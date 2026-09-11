import logger from '../utils/logger.js';

export function evaluateAndAlert(result) {
  // If the endpoint is healthy, do nothing
  if (result.healthy) return;

  // Determine the type of failure
  const is5xx = result.status >= 500 && result.status < 600;
  const isConnectionError = result.status === null;
  const isHighLatency = result.error && result.error.includes('Latency');

  // Only fire alerts for serious issues
  if (is5xx || isHighLatency || isConnectionError) {
    console.log('\n' + '='.repeat(66));
    console.log('  ALERT: Endpoint Failure Detected');
    console.log('='.repeat(66));
    console.log(`  Name:    ${result.name}`);
    console.log(`  URL:     ${result.url}`);
    console.log(`  Status:  ${result.status || 'N/A'}`);
    console.log(`  Latency: ${result.latencyMs !== null ? result.latencyMs + 'ms' : 'N/A'}`);
    console.log(`  Time:    ${result.timestamp}`);
    console.log(`  Reason:  ${result.error}`);
    console.log('='.repeat(66) + '\n');

    // Also log it to the error log file
    logger.error(`ALERT TRIGGERED for ${result.name} - Reason: ${result.error}`);
  }
}