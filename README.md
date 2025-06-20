# ManifestLife

ManifestLife is a full stack web application that provides a FastAPI backend and a React frontend. The backend exposes a REST API for managing user goals and community features, while the frontend offers a modern interface for interacting with the API.

## Backend Setup

1. Install the Python dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```
2. Start the API server:
   ```bash
   uvicorn backend.server:app --reload
   ```
   The API will be available at `http://localhost:8000/api`.

## Frontend Setup

1. Install Node dependencies:
   ```bash
   cd frontend
   yarn install
   ```
2. Run the development server:
   ```bash
   yarn start
   ```
   Open `http://localhost:3000` in your browser to view the app.
