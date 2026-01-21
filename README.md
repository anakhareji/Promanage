# ProManage

A professional project management tool with a FastAPI backend and React frontend.

## Prerequisites

- **Python 3.10+**
- **Node.js 16+**
- **SQL Server Express** (Local Instance)

## Installation & Setup

### 1. Backend Setup

Open a terminal in the `Backend` directory:

```powershell
cd Backend

# 1. Create Virtual Environment (if not already created)
python -m venv venv

# 2. Activate Virtual Environment
.\venv\Scripts\activate

# 3. Install Dependencies
pip install -r requirements.txt
```

### 2. Frontend Setup

Open a new terminal in the `frontend` directory:

```powershell
cd frontend

# 1. Install Dependencies
npm install
```

## Running the Application

You will need two separate terminals running at the same time.

### Terminal 1: Backend Server

```powershell
cd Backend
.\venv\Scripts\activate
uvicorn main:app --reload
```
*The backend will start at `http://127.0.0.1:8000`*

### Terminal 2: Frontend Client

```powershell
cd frontend
npm start
```
*The browser will automatically open `http://localhost:3000`*

## Troubleshooting

- **Database Connection**: Ensure your SQL Server instance is running and the connection string in `Backend/db.py` is correct.
- **Dependencies**: If `npm start` fails, try deleting `node_modules` and running `npm install` again.
