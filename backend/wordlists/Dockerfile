FROM node:13.1.0-alpine

COPY package* /srv/wordlists/
WORKDIR /srv/wordlists/src
RUN npm install
RUN npm install -g nodemon

COPY src /srv/wordlists/src
EXPOSE ${HTTP_PORT}

CMD ["npm", "start" ]

