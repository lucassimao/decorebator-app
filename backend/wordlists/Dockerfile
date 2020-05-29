FROM node:14.3.0-alpine

COPY package* /srv/wordlists/
WORKDIR /srv/wordlists/src
RUN npm install
RUN npm install -g nodemon

RUN apk add poppler-utils tesseract-ocr

COPY src /srv/wordlists/src
EXPOSE ${HTTP_PORT}

CMD ["npm", "start" ]

