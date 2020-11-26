import winston from 'winston';

const { combine, timestamp, prettyPrint, colorize, errors, simple } = winston.format;
const formats: winston.Logform.Format[] = [
    errors({ stack: true }),
    prettyPrint(),
    simple()
]

if (process.env.NODE_ENV !== 'production'){
    formats.unshift(timestamp(),colorize())
 }

const logger = winston.createLogger({
    transports: [new winston.transports.Console({
        format: combine(...formats),
        level: process.env.NODE_ENV === 'production' ? 'info' : "silly"
    })]
});

export default logger;