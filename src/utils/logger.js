import winston from 'winston';
import fs from 'fs'
import path from 'path';
import config from '../config/env.js';

if (!fs.existsSync(config.logDir)) {
  fs.mkdirSync(config.logDir, { recursive: true });
}


// Custom format for console output
const consoleFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level}: ${message}`;
});



const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    // Write errors to a separate file
    new winston.transports.File({
      filename: path.join(config.logDir, 'error.log'),
      level: 'error'
    }),
    // Write everything to health.log
    new winston.transports.File({
      filename: path.join(config.logDir, 'health.log')
    }),
    // Print to the terminal with colors
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
        consoleFormat
      )
    })
  ]
});

export default logger;