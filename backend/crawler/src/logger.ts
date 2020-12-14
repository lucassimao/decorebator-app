import { Request } from 'express';
import winston from 'winston';
import * as gcpMetadata from "gcp-metadata";

const { combine, prettyPrint, printf, errors, json } = winston.format;
let projectId: string | undefined;

const formats: winston.Logform.Format[] = [
    json(),
    errors({ stack: true }),
    prettyPrint()
]

if (process.env.NODE_ENV === 'production') {
    const gcpFormat = printf(({ level, ...rest }) => JSON.stringify({ ...rest, severity: level }));
    formats.push(gcpFormat)
}


async function getProjectId(): Promise<string | undefined> {
    if (!projectId) {
        const isAvailable = await gcpMetadata.isAvailable();
        if (!isAvailable) {
            return 'dev-environment-project';
        }

        projectId = await gcpMetadata.project('project-id');
    }

    return projectId;
}



const logger = winston.createLogger({
    transports: [new winston.transports.Console({
        format: combine(...formats),
        level: process.env.NODE_ENV === 'production' ? 'info' : "silly"
    })]
});

export const createHttpRequestLogger = async (req: Request): Promise<winston.Logger> => {
    const traceHeader = req.header('X-Cloud-Trace-Context') ?? '';
    const projectId = await getProjectId();
    const [trace] = traceHeader.split('/');
    let defaultMeta
    if (traceHeader) {
        defaultMeta = { 'logging.googleapis.com/trace': `projects/${projectId}/traces/${trace}` };
    }

    const logger = winston.createLogger({
        defaultMeta,
        format: combine(...formats),
        transports: [new winston.transports.Console({
            level: 'silly',
        })]
    });

    return logger;
}

export default logger;