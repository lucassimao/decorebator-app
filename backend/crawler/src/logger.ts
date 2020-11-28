import winston from 'winston';

const { combine, timestamp, prettyPrint, colorize, errors, simple,json } = winston.format;
const formats: winston.Logform.Format[] = [
    // simple(),
    // json(),
    prettyPrint(),
    errors({ stack: true }),
]

if (process.env.NODE_ENV !== 'production'){
    formats.unshift(timestamp(),colorize())
 }

const logger = winston.createLogger({
    transports: [new winston.transports.Console({
        format: combine(...formats),
        level:'silly' //process.env.NODE_ENV === 'production' ? 'info' : "silly"
    })]
});

export default logger;