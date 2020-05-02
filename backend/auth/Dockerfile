FROM node:14.0.0-alpine

COPY package.json /srv/auth/
COPY package-lock.json /srv/auth/
WORKDIR /srv/auth

RUN apk add --no-cache python2 g++ make
RUN npm install
RUN npm install -g nodemon

COPY src /srv/auth/src

EXPOSE ${HTTP_PORT}

CMD ["npm","start"] 
