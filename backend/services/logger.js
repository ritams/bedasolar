import chalk from 'chalk';
import fs from 'fs';
import path from 'path';

class Logger {
  constructor() {
    this.logLevels = {
      DEBUG: 0,
      INFO: 1,
      WARN: 2,
      ERROR: 3
    };
    
    this.currentLevel = this.logLevels.INFO;
    this.logFile = path.join(process.cwd(), 'logs', 'app.log');
    this.ensureLogDirectory();
  }

  ensureLogDirectory() {
    const logDir = path.dirname(this.logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  formatTimestamp() {
    return new Date().toISOString().replace('T', ' ').substring(0, 19);
  }

  formatMessage(level, message, context = {}) {
    const timestamp = this.formatTimestamp();
    const contextStr = Object.keys(context).length > 0 ? ` | ${JSON.stringify(context)}` : '';
    return `[${timestamp}] [${level}] ${message}${contextStr}`;
  }

  writeToFile(formattedMessage) {
    try {
      fs.appendFileSync(this.logFile, formattedMessage + '\n');
    } catch (error) {
      console.error('Failed to write to log file:', error.message);
    }
  }

  log(level, message, context = {}) {
    if (this.logLevels[level] < this.currentLevel) return;

    const formattedMessage = this.formatMessage(level, message, context);
    this.writeToFile(formattedMessage);

    const timestamp = chalk.gray(`[${this.formatTimestamp()}]`);
    const contextStr = Object.keys(context).length > 0 ? chalk.cyan(` | ${JSON.stringify(context)}`) : '';

    switch (level) {
      case 'DEBUG':
        console.log(timestamp, chalk.magenta('[DEBUG]'), message, contextStr);
        break;
      case 'INFO':
        console.log(timestamp, chalk.blue('[INFO]'), message, contextStr);
        break;
      case 'WARN':
        console.log(timestamp, chalk.yellow('[WARN]'), message, contextStr);
        break;
      case 'ERROR':
        console.log(timestamp, chalk.red('[ERROR]'), message, contextStr);
        break;
    }
  }

  debug(message, context = {}) {
    this.log('DEBUG', message, context);
  }

  info(message, context = {}) {
    this.log('INFO', message, context);
  }

  warn(message, context = {}) {
    this.log('WARN', message, context);
  }

  error(message, context = {}) {
    this.log('ERROR', message, context);
  }

  // Special methods for common use cases
  request(method, path, statusCode, duration, context = {}) {
    const status = statusCode >= 400 ? '[ERROR]' : statusCode >= 300 ? '[REDIRECT]' : '[SUCCESS]';
    const color = statusCode >= 400 ? chalk.red : statusCode >= 300 ? chalk.yellow : chalk.green;
    
    const message = `${status} ${method} ${path} ${color(statusCode)} - ${duration}ms`;
    this.info(message, context);
  }

  startup(service, port, context = {}) {
    const message = `[STARTUP] ${service} started successfully on port ${chalk.cyan(port)}`;
    this.info(message, context);
  }

  database(action, status, context = {}) {
    const statusLabel = status === 'connected' ? '[CONNECTED]' : status === 'error' ? '[ERROR]' : '[PENDING]';
    const message = `${statusLabel} Database ${action}: ${status}`;
    this.info(message, context);
  }

  upload(filename, status, context = {}) {
    const statusLabel = status === 'started' ? '[STARTED]' : status === 'completed' ? '[COMPLETED]' : status === 'failed' ? '[FAILED]' : '[PROCESSING]';
    const message = `${statusLabel} File upload ${status}: ${filename}`;
    this.info(message, context);
  }

  ai(action, status, context = {}) {
    const statusLabel = status === 'started' ? '[AI-STARTED]' : status === 'completed' ? '[AI-COMPLETED]' : status === 'failed' ? '[AI-FAILED]' : '[AI-PROCESSING]';
    const message = `${statusLabel} AI ${action} ${status}`;
    this.info(message, context);
  }

  setLevel(level) {
    if (this.logLevels[level] !== undefined) {
      this.currentLevel = this.logLevels[level];
      this.info(`Log level set to ${level}`);
    }
  }
}

// Create singleton instance
const logger = new Logger();

export default logger; 