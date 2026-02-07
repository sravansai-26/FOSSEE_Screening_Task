import pandas as pd
import numpy as np
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Equipment, UploadHistory

class CSVUploadView(APIView):
    def post(self, request):
        file = request.FILES.get('file')
        if not file:
            return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # 1. Load CSV into DataFrame
            df = pd.read_csv(file)
            
            # 2. Robust Header Cleaning (strips invisible spaces/newlines)
            df.columns = df.columns.str.strip()
            
            # 3. Validation: Check if required columns exist
            required_cols = ['Equipment Name', 'Type', 'Flowrate', 'Pressure', 'Temperature']
            missing_cols = [col for col in required_cols if col not in df.columns]
            
            if missing_cols:
                return Response({
                    "error": f"Invalid CSV format. Missing columns: {', '.join(missing_cols)}"
                }, status=status.HTTP_400_BAD_REQUEST)

            # 4. Data Sanitization: Convert columns to numeric, replace errors with 0
            # This ensures the API doesn't crash if a user enters "N/A" or text in a number field
            for col in ['Flowrate', 'Pressure', 'Temperature']:
                df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)

            # 5. Analysis Logic
            summary = {
                "total_count": len(df),
                "avg_flowrate": round(float(df['Flowrate'].mean()), 2),
                "avg_pressure": round(float(df['Pressure'].mean()), 2),
                "avg_temperature": round(float(df['Temperature'].mean()), 2),
                "type_distribution": df['Type'].value_counts().to_dict()
            }

            # 6. History Management: Maintain exactly the last 5 uploads
            UploadHistory.objects.create(
                filename=file.name,
                total_count=summary['total_count'],
                avg_flowrate=summary['avg_flowrate'],
                avg_pressure=summary['avg_pressure'],
                avg_temperature=summary['avg_temperature']
            )
            
            # Keep only the latest 5 entries in the database
            all_history = UploadHistory.objects.all().order_by('-uploaded_at')
            if all_history.count() > 5:
                # Delete anything beyond the 5th most recent entry
                ids_to_keep = all_history.values_list('id', flat=True)[:5]
                UploadHistory.objects.exclude(id__in=ids_to_keep).delete()

            return Response({
                "summary": summary,
                "raw_data": df.replace({np.nan: None}).to_dict(orient='records')
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            # Returns a professional error message to the React/PyQt5 frontend
            return Response({"error": f"Server Error: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

class HistoryView(APIView):
    def get(self, request):
        # Retrieve the last 5 datasets sorted by most recent
        history = UploadHistory.objects.all().order_by('-uploaded_at')[:5]
        data = [{
            "filename": h.filename,
            "total": h.total_count,
            "avg_temp": h.avg_temperature,
            "date": h.uploaded_at.strftime("%b %d, %H:%M")
        } for h in history]
        return Response(data)