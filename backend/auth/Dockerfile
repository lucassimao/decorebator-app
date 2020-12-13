FROM node:14.3.0-alpine

RUN apk add --no-cache git python2 g++ make

WORKDIR /srv/auth
COPY package* /srv/auth/
COPY tsconfig.json /srv/auth/

RUN npm ci
RUN apk del g++ make python2 git

COPY src /srv/auth/src
RUN npm run build
RUN npm prune --production
EXPOSE ${HTTP_PORT}

CMD ["npm","start"] 
