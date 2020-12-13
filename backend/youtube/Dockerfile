FROM node:14.0.0-alpine

RUN apk add git

COPY package* /srv/youtube/
COPY tsconfig.json /srv/youtube

WORKDIR /srv/youtube
RUN npm ci
RUN apk del git

COPY src /srv/youtube/src
RUN npm run build
RUN npm prune --production
EXPOSE ${PORT}

CMD ["npm", "start" ]

