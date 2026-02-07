from django.urls import path
from .views import CSVUploadView, HistoryView # These must match the class names above

urlpatterns = [
    path('upload/', CSVUploadView.as_view(), name='upload-csv'),
    path('history/', HistoryView.as_view(), name='get-history'),
]