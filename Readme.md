# EcoMap – Environmental Pollution Monitoring & Impact Analysis System

EcoMap is a  web application designed to visualize air, water, and land pollution data an interactive map and natural disaster alerts . It leverages AI to generate impact analysis reports, helping users understand environmental issues and potential solutions.

---

## 🗺️ Project Overview

EcoMap enables users to:
- View pollution data (air, water, land) across Gujarat districts.
- Explore historical and real-time data on an interactive map.
- Natural disaster alerts
- Generate AI-powered reports analyzing pollution impact and suggesting solutions.

---

## 🏗️ System Architecture

```
[Frontend (React.js + Leaflet)]
    |
    |  (Axios HTTP requests)
    v
[Backend (Node.js + Express.js)]
    |
    |  (API calls, AI integration)
    v
[External APIs: OpenWeather, Gemini AI]
```

- **Frontend:** Displays map, layers, and UI panels.
- **Backend:** Handles data requests, AI report generation, and API integration.
- **External APIs:** Supplies weather/pollution data and AI-generated reports.

---

## 📁 Folder Structure

```
ecomap-frontend-leaflet/
├── client/      # React frontend
│   ├── src/
│   │   ├── components/   # Map, layers, panels
│   │   ├── assets/       # GeoJSON, datasets
│   │   └── App.jsx
│   └── public/
├── server/      # Node.js backend
│   ├── routes/  # API & AI endpoints
│   ├── controllers/
│   ├── app.js   # Express server entry
│   └── .env     # Environment variables
└── README.md
```

---

## 🖼️ Frontend Components

### 1. Map Rendering Logic
- Uses **React Leaflet** to display Gujarat district boundaries (GeoJSON).
- River paths and monitoring stations are plotted as overlays.

### 2. Air Pollution Layer
- Fetches real-time air quality data from OpenWeather API.
- Visualizes AQI levels using color-coded markers and polygons.

### 3. Water Pollution Layer
- Loads river path and station datasets.
- Displays water quality indicators (e.g., pH, contaminants) at monitoring points.

### 4. Land Pollution Layer
- Uses static JSON for historical land pollution data.
- Renders affected areas with shaded polygons.

### 5. Solutions & Impact Report Panel
- Users select a region and pollution type.
- “Generate Impact Analysis” button triggers AI report generation.
- Panel displays AI-generated insights and suggested solutions.

---

## ⚙️ Backend Flow

### 1. Express Server
- Serves API endpoints for frontend data requests.
- Handles CORS and environment variables via `dotenv`.

### 2. AI Route Handling
- `/api/impact-report`: Receives region/type, forwards to Gemini AI.

### 3. Gemini AI Integration
- Uses Google Generative AI SDK.
- Sends pollution context, receives impact analysis and solutions.

---

## 🧠 How “Generate Impact Analysis” Works

1. **User Action:** Selects region/type, clicks “Generate Impact Analysis”.
2. **Frontend:** Sends POST request to `/api/impact-report` with selected data.
3. **Backend:** Receives request, formats context, calls Gemini AI API.
4. **Gemini AI:** Processes data, returns impact analysis and solutions.
5. **Frontend:** Displays AI-generated report in the panel.

---

## 🔑 Environment Variable Setup

Create `.env` files in both `client` and `server` folders.

**Example (`server/.env`):**
```env
OPENWEATHER_API_KEY=your_openweather_api_key
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
```
**Note:** Never commit actual API keys.

---

## 🚀 Running the Project Locally

1. **Clone the repo:**
   ```bash
   git clone https://github.com/yourusername/ecomap-frontend-leaflet.git
   cd ecomap-frontend-leaflet
   ```
2. **Install dependencies:**
   - Frontend:
     ```bash
     cd client
     npm install
     npm run dev
     ```
   - Backend:
     ```bash
     cd ../server
     npm install
     npm start
     ```
3. **Access the app:** Open [http://localhost:3000](http://localhost:3000) .

---

## 🛠️ Common Issues & Troubleshooting

- **API Keys:** Ensure `.env` files are set up with valid keys.
- **CORS Errors:** Confirm backend enables CORS for frontend origin.
- **Env Loading:** Restart servers after changing `.env` files.
- **Map Not Loading:** Check GeoJSON/data file paths and API connectivity.

---

## 💬 How to Explain This Project (Interview/Demo)

“EcoMap is a web app that visualizes pollution data for Gujarat using interactive maps. It combines real-time and historical data, and uses AI to generate impact analysis reports and solutions. The frontend is built with React and Leaflet for mapping, while the backend uses Node.js and Express to fetch data and integrate with AI APIs.”

---

## 📄 License

This project is for educational and demonstration purposes.
