FROM node:14.0.0-alpine

ARG GITHUB_TOKEN
RUN npm config set @lucassimao:registry https://npm.pkg.github.com/lucassimao
RUN npm config set //npm.pkg.github.com/:_authToken $GITHUB_TOKEN
RUN apk add git

COPY package* /srv/youtube/

WORKDIR /srv/youtube
RUN npm ci --production
RUN npm install -g nodemon
RUN apk del git

COPY src /srv/youtube/src
EXPOSE ${PORT}

CMD ["npm", "start" ]

