import { createLogger, format, transports } from 'winston';

const timezoned = () =>
  new Date().toLocaleString('en-GB', {
    timeZone: 'Africa/Lagos',
  });

const logger = createLogger({
  format: format.combine(format.timestamp({ format: timezoned }), format.errors({ stack: true }), format.json()),
  defaultMeta: { service: 'shoprus-service' },
  transports: [new transports.Console()],
});

export default logger;
