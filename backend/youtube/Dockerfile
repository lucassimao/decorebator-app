FROM node:13.1.0-alpine

COPY package* /srv/youtube/

WORKDIR /srv/youtube
RUN npm install
RUN npm install -g nodemon

COPY src /srv/youtube/src
EXPOSE ${HTTP_PORT}

CMD ["npm", "start" ]

