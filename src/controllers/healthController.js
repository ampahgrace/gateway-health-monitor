import { getState } from '../models/healthstate.js';
import endpoints from '../config/endpoints.js';

export function getHealthStatus(req, res) {
  const state = getState();

  // Build a summary from the current state
  const statusArray = Object.values(state);

  const total = endpoints.length;
  const healthy = statusArray.filter(s => s.healthy).length;
  const unhealthy = statusArray.filter(s => !s.healthy && s.status !== null).length;
  const down = statusArray.filter(s => s.status === null).length;

  res.json({
    timestamp: new Date().toISOString(),
    summary: {
      total,
      healthy,
      unhealthy,
      down
    },
    endpoints: state
  });
}