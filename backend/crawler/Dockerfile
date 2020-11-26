FROM node:14.3.0-alpine

COPY package* /srv/crawler
COPY src /srv/crawler/src

WORKDIR /srv/crawler
RUN npm ci --production
RUN npm install -g nodemon

EXPOSE ${HTTP_PORT}

CMD ["npm", "start" ]

