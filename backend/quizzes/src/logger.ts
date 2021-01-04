import winston from "winston";

const { combine, prettyPrint, printf, errors, json } = winston.format;

const formats: winston.Logform.Format[] = [
  json(),
  errors({ stack: true }),
  prettyPrint(),
];

if (process.env.NODE_ENV === "production") {
  const gcpFormat = printf(({ level, ...rest }) =>
    JSON.stringify({ ...rest, severity: level })
  );
  formats.push(gcpFormat);
}

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: combine(...formats),
      level: process.env.NODE_ENV === "production" ? "info" : "silly",
    }),
  ],
});

export default logger;
