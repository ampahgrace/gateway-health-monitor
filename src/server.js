import config from './config/env.js';
import endpoints from './config/endpoints.js';

import { checkEndpoint } from './services/pollerService.js';

import { evaluateAndAlert } from './services/alertService.js';

import logger from './utils/logger.js';

import express from 'express'
import healthRoutes from './routes/healthRoutes.js';

const app = express();

app.use('/api', healthRoutes)


async function runPollingCycle() {
  logger.info(`--- Starting Polling Cycle (${endpoints.length} endpoints) ---`);

  // Poll all endpoints in parallel using Promise.allSettled
  // (allSettled waits for ALL to finish, even if some fail)
  const promises = endpoints.map(endpoint => checkEndpoint(endpoint));
  const results = await Promise.allSettled(promises);

  // Check each result for alerts
  results.forEach(promiseResult => {
    if (promiseResult.status === 'fulfilled') {
      evaluateAndAlert(promiseResult.value);
    }
  });
}








function start() {
  logger.info('Starting Gateway Health Monitor...');
  logger.info(`Poll Interval: ${config.pollIntervalMs}ms`);
  logger.info(`Latency Threshold: ${config.latencyThresholdMs}ms`);

  // Run the first check right away (don't wait 30 seconds)
  runPollingCycle();

  // Then repeat every POLL_INTERVAL_MS milliseconds
  const intervalId = setInterval(runPollingCycle, config.pollIntervalMs);

  // Start the Express API server
  app.listen(config.port, () => {
    logger.info(`API Server listening on port ${config.port}`);
  });

  // When user presses Ctrl+C, stop cleanly
  process.on('SIGINT', () => {
    logger.info('Gracefully shutting down...');
    clearInterval(intervalId);
    process.exit(0);
  });
}

start();