FROM node:14.3.0-alpine

RUN apk add --no-cache git python2 g++ make

WORKDIR /srv/auth
COPY package* /srv/auth/
RUN npm ci --production
RUN apk del g++ make python2 git

COPY src /srv/auth/src
EXPOSE ${HTTP_PORT}

CMD ["npm","start"] 
