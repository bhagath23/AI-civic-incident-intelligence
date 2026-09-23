# 🌍 Civic Incident Intelligence

An AI-powered real-time disaster and humanitarian monitoring system that collects disaster incidents, classifies them using a fine-tuned DistilBERT model, and presents the information through a React dashboard.

The system is designed to help users quickly understand disaster situations, humanitarian needs, evacuations, injuries, infrastructure damage, and other incident categories.

---

## 🚀 Features

- 🌍 Real-time disaster monitoring using GDACS
- 🤖 AI-powered incident classification using DistilBERT
- 📊 Interactive React dashboard
- 🔎 Filter incidents by humanitarian category
- 🚨 Identify evacuation-related incidents
- 🏥 Identify injured or deceased people
- 🆘 Identify urgent humanitarian needs
- 🇮🇳 India-specific news monitoring
- 🔗 Links to original incident/news sources
- ⚡ FastAPI backend
- 💻 React + Vite frontend

---

## 🧠 AI Classification

The project uses a fine-tuned **DistilBERT** model to classify disaster and humanitarian information into 10 categories:

1. Caution & Advice
2. Displaced People & Evacuations
3. Infrastructure & Utility Damage
4. Injured or Dead People
5. Missing or Found People
6. Not Humanitarian
7. Other Relevant Information
8. Requests or Urgent Needs
9. Rescue / Volunteering / Donation Effort
10. Sympathy & Support

---

## 🏗️ System Architecture

```text
                    ┌──────────────────┐
                    │      GDACS       │
                    │  Disaster Feed   │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │     FastAPI      │
                    │     Backend      │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │    DistilBERT    │
                    │  Classification  │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │   React + Vite   │
                    │    Dashboard     │
                    └──────────────────┘
```

---

## 🛠️ Technologies Used

### Backend

- Python
- FastAPI
- PyTorch
- Hugging Face Transformers
- DistilBERT
- Requests
- Feedparser

### Frontend

- React
- Vite
- JavaScript
- CSS

### Data Sources

- GDACS disaster feed
- TheNewsAPI for India news

---

## 📁 Project Structure

```text
AI-civic-incident-intelligence/
│
├── backend/
│   ├── main.py
│   ├── model.py
│   ├── news_service.py
│   ├── test_news.py
│   └── .env
│
├── data/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── notebooks/
│   ├── best_distilbert_model.pt
│   ├── load_data01.ipynb
│   └── transformer_model01.ipynb
│
├── .gitignore
└── README.md
```

---

# ⚙️ Installation

## 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/AI-civic-incident-intelligence.git
```

```bash
cd AI-civic-incident-intelligence
```

---

# 🐍 Backend Setup

Create a Python virtual environment:

```bash
python -m venv .venv
```

Activate it on Windows:

```powershell
.venv\Scripts\Activate.ps1
```

Install the required packages:

```bash
pip install fastapi uvicorn requests python-dotenv feedparser torch transformers
```

---

## 🔑 Environment Variables

Create:

```text
backend/.env
```

Add your API key:

```env
NEWS_API_TOKEN=your_api_token_here
```

Do **not** commit `.env` to GitHub.

---

## ▶️ Start the Backend

From the project root:

```powershell
cd backend
```

Then:

```powershell
uvicorn main:app --reload
```

Backend will run at:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

---

# ⚛️ Frontend Setup

Open a second terminal.

```powershell
cd frontend
```

Install dependencies:

```powershell
npm install
```

Start the development server:

```powershell
npm run dev
```

Frontend will run at:

```text
http://localhost:5173
```

---

# 🔌 API Endpoints

## Home

```http
GET /
```

Checks whether the API is running.

---

## Get Incidents

```http
GET /incidents
```

Fetches disaster incidents from GDACS and classifies them using the trained DistilBERT model.

---

## Predict Incident Category

```http
POST /predict
```

Example request:

```json
{
  "text": "Thousands of people were evacuated after severe flooding."
}
```

Example response:

```json
{
  "text": "Thousands of people were evacuated after severe flooding.",
  "prediction": "displaced_people_and_evacuations"
}
```

---

## India News

```http
GET /india-news/{category}
```

Supported categories:

```text
injured_or_dead_people
displaced_people_and_evacuations
requests_or_urgent_needs
```

---

# 📸 Screenshots

## Dashboard

![Civic Incident Intelligence Dashboard](screenshots/dashboard.png)

## Incident Categories

![Incident Categories](screenshots/categories.png)

## AI Classified Incidents

![AI Classified Incidents](screenshots/incidents.png)

> Place your screenshots inside the `screenshots/` folder and update the filenames above if necessary.

---

# 🤖 Machine Learning Pipeline

```text
Raw Incident Text
       ↓
Text Preprocessing
       ↓
DistilBERT Tokenization
       ↓
Fine-tuned DistilBERT
       ↓
10-Class Classification
       ↓
Predicted Humanitarian Category
       ↓
React Dashboard
```


## 🐳 Docker Setup

The entire application is containerized using Docker and Docker Compose.

### Architecture

```text
                    ┌─────────────────────┐
                    │     GDACS RSS       │
                    │   Live Incidents    │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    FastAPI Backend   │
                    │      Port 8000       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │     DistilBERT      │
                    │  10-Class NLP Model │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React Frontend    │
                    │      Port 5173       │
                    └─────────────────────┘
---

# 🎯 Project Objective

The objective of this project is to build an intelligent monitoring system that transforms large amounts of disaster-related information into structured humanitarian insights.

Instead of manually reading every disaster report, the system automatically processes incident information and categorizes it into meaningful humanitarian classes.

---

# 🔮 Future Improvements

- Real-time automatic refresh
- Interactive disaster map
- Geographic filtering
- Severity scoring
- Historical incident analytics
- More news sources
- Multilingual incident classification
- Improved model accuracy
- Automated alerts for critical incidents
- Cloud deployment

---

# 👨‍💻 Project

**Civic Incident Intelligence**

AI-powered disaster and humanitarian monitoring using **FastAPI, React, DistilBERT, and GDACS**.