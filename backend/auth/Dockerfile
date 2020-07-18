FROM node:14.3.0-alpine

ARG GITHUB_TOKEN
RUN npm config set @lucassimao:registry https://npm.pkg.github.com/lucassimao
RUN npm config set //npm.pkg.github.com/:_authToken $GITHUB_TOKEN
RUN apk add --no-cache git python2 g++ make
RUN npm install -g nodemon

WORKDIR /srv/auth
COPY package* /srv/auth/
RUN npm ci --production
RUN apk del g++ make python2 git

COPY src /srv/auth/src
EXPOSE ${HTTP_PORT}

CMD ["npm","start"] 
