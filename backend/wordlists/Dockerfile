FROM node:14.3.0-alpine

ARG GITHUB_TOKEN
RUN apk add g++ make python2 git poppler-utils tesseract-ocr
RUN npm config set @lucassimao:registry https://npm.pkg.github.com/lucassimao
RUN npm config set //npm.pkg.github.com/:_authToken $GITHUB_TOKEN

COPY package* /srv/wordlists/
WORKDIR /srv/wordlists
RUN npm ci --production
RUN npm install -g nodemon
RUN apk del g++ make python2 git

COPY src /srv/wordlists/src
EXPOSE ${PORT}

CMD ["npm", "start" ]

