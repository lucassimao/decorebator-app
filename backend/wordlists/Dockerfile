FROM node:12.9.1-alpine

ARG JWT_SECRET_KEY 
ARG MONGO_DB_URL

ENV JWT_SECRET_KEY ${JWT_SECRET_KEY}
ENV MONGO_DB_URL ${MONGO_DB_URL}
ENV NODE_ENV production
ENV HTTP_PORT 3000

COPY src /srv/wordlists/src
COPY package* /srv/wordlists/

WORKDIR /srv/wordlists/src
RUN npm install

EXPOSE 3000
CMD [ "npm", "start" ]

