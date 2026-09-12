# Gateway Health Monitor

A backend Node.js tool that polls HTTP endpoints, logs their status and latency, and exposes an API to view the current health state of the gateway. 

This project is structured using the **MVC pattern (Models, Routes, Controllers, Services)** to keep the codebase clean and maintainable.

## Features
- **Background Polling Engine:** Checks multiple endpoints at configurable intervals.
- **Alert Engine:** Triggers visible console alerts when an endpoint returns a 5xx status, times out, or exceeds the latency threshold.
- **REST API:** Exposes a `GET /api/health` route to fetch real-time gateway status.
- **Structured Logging:** Uses `winston` to log human-readable output to the console and JSON-formatted output to a daily log file (`logs/health.log`).

## Tech Stack
- **Node.js + Express** (Runtime & API)
- **node-fetch** (HTTP requests)
- **dotenv** (Environment config)
- **winston** & **chalk** (Logging & terminal styling)

---

## Setup & Run

### 1. Install dependencies
```bash
npm install
```

### 2. Configure Environment
Copy the example environment variables:
```bash
cp .env.example .env
```
*Optional: Edit `.env` to change polling intervals or ports.*

### 3. Run the application
To test the failure alerting, it's best to run both the mock server and the health monitor in two separate terminal windows.

**Terminal 1: Start the Mock Server**
```bash
npm run mock-server
```
*(This starts a local server on port 4000 that simulates a healthy and an unstable endpoint)*

**Terminal 2: Start the Health Monitor**
```bash
npm start
```

---

## Viewing the API

While the monitor is running, you can view the live health status by hitting the API (in your browser or via curl):
```bash
curl http://localhost:3000/api/health
```

## Adding New Endpoints

To monitor a new SMS gateway endpoint, simply add it to `src/config/endpoints.js`:
```javascript
{ name: "New SMS Route", url: "https://api.nalosolutions.com/v1/sms" }
```
