import dotenv from 'dotenv'

dotenv.config()

export default {
    port: process.env.PORT || 3000,
  pollIntervalMs: parseInt(process.env.POLL_INTERVAL_MS, 10) || 30000,
  latencyThresholdMs: parseInt(process.env.LATENCY_THRESHOLD_MS, 10) || 2000,
  logDir: process.env.LOG_DIR || './logs'
}