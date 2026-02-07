import sys
import requests
import matplotlib.pyplot as plt
from matplotlib.backends.backend_qt5agg import FigureCanvasQTAgg as FigureCanvas
from PyQt5.QtWidgets import (QApplication, QMainWindow, QPushButton, QVBoxLayout, 
                             QHBoxLayout, QWidget, QFileDialog, QTableWidget, 
                             QTableWidgetItem, QLabel, QFrame, QMessageBox)
from PyQt5.QtCore import Qt
from PyQt5.QtGui import QFont

class FOSSEEDesktopApp(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("FOSSEE | Chemical Visualizer Desktop")
        self.resize(1000, 700)
        self.setStyleSheet("background-color: #F8FAFC;")
        
        # Main Layout
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        self.main_layout = QHBoxLayout(central_widget)

        # Sidebar
        self.sidebar = QVBoxLayout()
        self.init_sidebar()
        self.main_layout.addLayout(self.sidebar, 1)

        # Content Area (Table + Chart)
        self.content_area = QVBoxLayout()
        self.init_content_area()
        self.main_layout.addLayout(self.content_area, 3)

    def init_sidebar(self):
        title = QLabel("FOSSEE\nChemVisualizer")
        title.setFont(QFont('Segoe UI', 16, QFont.Bold))
        title.setStyleSheet("color: #1E293B; margin-bottom: 20px;")
        self.sidebar.addWidget(title)

        self.upload_btn = QPushButton("Upload CSV")
        self.upload_btn.setStyleSheet("""
            QPushButton {
                background-color: #2563EB; color: white; border-radius: 8px;
                padding: 12px; font-weight: bold; font-size: 14px;
            }
            QPushButton:hover { background-color: #1D4ED8; }
        """)
        self.upload_btn.clicked.connect(self.handle_upload)
        self.sidebar.addWidget(self.upload_btn)

        self.count_box = self.create_stat_card("Total Equipment", "0")
        self.temp_box = self.create_stat_card("Avg Temperature", "0.0°C")
        self.sidebar.addStretch()

    def create_stat_card(self, label, value):
        frame = QFrame()
        frame.setStyleSheet("background-color: white; border-radius: 12px; border: 1px solid #E2E8F0;")
        layout = QVBoxLayout(frame)
        l_lbl = QLabel(label)
        l_lbl.setStyleSheet("color: #64748B; font-size: 10px; font-weight: bold;")
        v_lbl = QLabel(value)
        v_lbl.setStyleSheet("color: #1E293B; font-size: 20px; font-weight: bold;")
        layout.addWidget(l_lbl)
        layout.addWidget(v_lbl)
        self.sidebar.addWidget(frame)
        return v_lbl

    def init_content_area(self):
        self.table = QTableWidget()
        self.table.setColumnCount(4)
        self.table.setHorizontalHeaderLabels(["Name", "Type", "Flowrate", "Pressure"])
        self.table.setStyleSheet("background-color: white; border: 1px solid #E2E8F0; border-radius: 8px;")
        self.content_area.addWidget(self.table)

        self.figure = plt.figure(figsize=(5, 4), dpi=100)
        self.canvas = FigureCanvas(self.figure)
        self.content_area.addWidget(self.canvas)

    def handle_upload(self):
        file_path, _ = QFileDialog.getOpenFileName(self, "Open CSV", "", "CSV Files (*.csv)")
        if file_path:
            try:
                with open(file_path, 'rb') as f:
                    # Hits your Django Backend API
                    r = requests.post("http://127.0.0.1:8000/api/upload/", files={'file': f})
                    if r.status_code == 201:
                        self.update_ui(r.json())
                    else:
                        QMessageBox.warning(self, "API Error", f"Backend rejected the file: {r.text}")
            except Exception as e:
                QMessageBox.critical(self, "Connection Error", f"Could not connect to Django: {str(e)}")

    def update_ui(self, res):
        summary = res['summary']
        data = res['raw_data']

        # Update Stats
        self.count_box.setText(str(summary['total_count']))
        self.temp_box.setText(f"{summary['avg_temperature']}°C")

        # Update Table (First 20 rows for performance)
        self.table.setRowCount(len(data))
        for i, row in enumerate(data[:20]):
            self.table.setItem(i, 0, QTableWidgetItem(str(row.get('Equipment Name', ''))))
            self.table.setItem(i, 1, QTableWidgetItem(str(row.get('Type', ''))))
            self.table.setItem(i, 2, QTableWidgetItem(str(row.get('Flowrate', ''))))
            self.table.setItem(i, 3, QTableWidgetItem(str(row.get('Pressure', ''))))

        # Update Chart
        self.figure.clear()
        ax = self.figure.add_subplot(111)
        labels = ['Flow', 'Pressure', 'Temp']
        vals = [summary['avg_flowrate'], summary['avg_pressure'], summary['avg_temperature']]
        ax.bar(labels, vals, color=['#3B82F6', '#10B981', '#F59E0B'])
        ax.set_title("Equipment Metrics Analysis")
        self.canvas.draw()

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = FOSSEEDesktopApp()
    window.show()
    sys.exit(app.exec_())