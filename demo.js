import express from 'express';
const app = express();

const PORT = 4000;

// Always returns 200 — a perfectly healthy endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: "healthy" });
});

// Randomly returns 200 or 503 — simulates an unstable gateway
app.get('/unstable', (req, res) => {
  if (Math.random() > 0.5) {
    res.status(503).json({ error: "Service Unavailable" });
  } else {
    res.status(200).json({ status: "healthy" });
  }
});

// Responds after 3 seconds — triggers the latency alert (threshold is 2s)
app.get('/slow', (req, res) => {
  setTimeout(() => {
    res.status(200).json({ status: "slow but healthy" });
  }, 3000);
});

app.listen(PORT, () => {
  console.log(`Mock Failure Server running on port ${PORT}`);
  console.log('Endpoints available:');
  console.log(`  - GET http://localhost:${PORT}/health`);
  console.log(`  - GET http://localhost:${PORT}/unstable`);
  console.log(`  - GET http://localhost:${PORT}/slow`);
});