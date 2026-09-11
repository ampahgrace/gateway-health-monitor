import logger from '../utils/logger.js';
import { updateState } from '../models/healthstate.js';
import config from '../config/env.js';

export async function checkEndpoint(endpoint) {
  const startTime = Date.now();

  // Build the result object with defaults
  let result = {
    name: endpoint.name,
    url: endpoint.url,
    timestamp: new Date().toISOString(),
    status: null,
    latencyMs: null,
    healthy: false,
    error: null
  };

  try {
    // Set a 5-second timeout so we don't hang forever
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    // Make the HTTP request
    const response = await fetch(endpoint.url, { signal: controller.signal });
    clearTimeout(timeoutId);

    // Calculate how long the request took
    const latencyMs = Date.now() - startTime;
    result.status = response.status;
    result.latencyMs = latencyMs;

    // Decide if the endpoint is healthy:
    // - Must return a 2xx status code (response.ok)
    // - Must respond faster than our threshold (default 2000ms)
    if (response.ok && latencyMs <= config.latencyThresholdMs) {
      result.healthy = true;
    } else if (!response.ok) {
      result.error = `HTTP ${response.status} ${response.statusText}`;
    } else {
      result.error = `Latency ${latencyMs}ms exceeds threshold of ${config.latencyThresholdMs}ms`;
    }

  } catch (error) {
    // Handle network errors (timeout, DNS failure, connection refused, etc.)
    if (error.name === 'AbortError') {
      result.error = 'Request timed out after 5000ms';
    } else {
      result.error = error.message || 'Request failed';
    }
  }

  // Save this result to our in-memory "database"
  updateState(endpoint.name, result);

  // Log the result to console and file
  const statusIcon = result.healthy ? '[OK]' : '[FAIL]';
  const statusText = result.status || 'ERR';
  const latencyText = result.latencyMs !== null ? `${result.latencyMs}ms` : 'N/A';

  const logMessage = `${statusIcon} ${endpoint.name.padEnd(16)} | ${String(statusText).padEnd(3)} | ${latencyText.padEnd(6)}`;

  if (result.healthy) {
    logger.info(logMessage);
  } else {
    logger.warn(`${logMessage} | Reason: ${result.error}`);
  }

  return result;
}