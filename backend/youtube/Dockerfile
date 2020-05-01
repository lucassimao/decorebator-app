FROM node:14.0.0-alpine

COPY package* /srv/youtube/

WORKDIR /srv/youtube
RUN npm install
RUN npm install -g nodemon

COPY src /srv/youtube/src
EXPOSE ${HTTP_PORT}

CMD ["npm", "start" ]

