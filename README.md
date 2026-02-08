# ChemVisualizer: Hybrid Chemical Equipment Analytics 🧪

## 📋 Project Overview
ChemVisualizer is a production-grade **Hybrid Data Visualization Application** developed for the **FOSSEE Screening Task – IIT Bombay**.  

The system bridges the gap between **Web dashboards** and **Desktop scientific tools** by using a single **Django REST API backend** that serves both platforms.

Chemical engineers can upload equipment datasets (Flowrate, Pressure, Temperature), perform automated statistical analysis, and instantly visualize insights through interactive charts and plots.

---

## 🚀 Key Features
- Hybrid Architecture — One backend serving both Web and Desktop clients
- Real-time CSV analytics using Pandas
- Interactive charts and scientific plots
- Upload history tracking with SQLite
- Clean, professional UI/UX
- Production-ready modular folder structure

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| Backend | Django, Django REST Framework, Pandas, SQLite |
| Web Frontend | React 18, Vite, Tailwind CSS, Chart.js, Framer Motion |
| Desktop Frontend | Python, PyQt5, Matplotlib, Requests |
| DevOps | Git, GitHub, Vercel |

---

## 📂 Project Structure

```text
FOSSEE_Screening_Task/
├── backend/                # Django REST API (Core logic & analytics)
├── frontend-web/           # React + Vite Web dashboard
├── frontend_desktop/       # PyQt5 + Matplotlib Desktop app
├── .gitignore
├── LICENSE
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Prerequisites
- Python 3.8+
- Node.js & npm
- Git

---

### 2️⃣ Backend Setup

```bash
cd backend
python -m venv venv
```

Activate environment:

Windows:
```bash
.\venv\Scripts\activate
```

Linux/Mac:
```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install django djangorestframework django-cors-headers pandas numpy gunicorn
```

Run server:

```bash
python manage.py makemigrations api
python manage.py migrate
python manage.py runserver
```

---

### 3️⃣ Web Frontend Setup

```bash
cd frontend-web
npm install
npm run dev
```

Open:
```
http://localhost:5173
```

---

### 4️⃣ Desktop Frontend Setup

```bash
cd frontend_desktop
pip install PyQt5 requests matplotlib
python main.py
```

---

## 📝 Usage Instructions

1. Prepare a CSV file with headers:
   ```
   Equipment Name, Type, Flowrate, Pressure, Temperature
   ```

2. Upload file through:
   - Web Dashboard OR
   - Desktop Application

3. View:
   - Bar charts for averages
   - Pie charts for distribution
   - Historical uploads

4. Check the “Recent Uploads” section for stored results

---

## 📊 System Architecture

```
           React Web App
                │
                ▼
           Django REST API
                ▲
                │
        PyQt5 Desktop App
```

Single backend → Multiple clients → Unified analytics

---

## ✨ Why Hybrid?

ChemVisualizer combines the strengths of:

- Web → Accessibility + deployment
- Desktop → Scientific plotting + performance

This makes it ideal for **engineering & research environments**.

---

## 🧑‍💻 Developed By

Sravan Sai Vuppula  
B.Tech CSE  

GitHub: https://github.com/sravansai-26  
LinkedIn: https://www.linkedin.com/in/sravan-sai-vuppula/

---

## ⚖️ License
This project is licensed under the MIT License.

---

## ⭐ Acknowledgement
Built as part of the **FOSSEE Internship Screening Process – IIT Bombay** to demonstrate hybrid application architecture and engineering-grade analytics tools.
