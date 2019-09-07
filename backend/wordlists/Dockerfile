FROM node:12.9.1-alpine

ARG NODE_ENV=development
ARG JWT_SECRET_KEY 
ARG MONGO_DB_URL
ARG HTTP_PORT

ENV JWT_SECRET_KEY ${JWT_SECRET_KEY}
ENV NODE_ENV ${NODE_ENV}
ENV MONGO_DB_URL ${MONGO_DB_URL}
ENV HTTP_PORT ${HTTP_PORT}

COPY wordlists ~/wordlists
COPY common ~/common
WORKDIR ~/wordlists

EXPOSE ${HTTP_PORT}
RUN npm install pm2 -g
CMD [ "pm2-runtime", "npm", "--", "start" ]

