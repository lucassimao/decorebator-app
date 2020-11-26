FROM node:14.15.1-alpine3.12

COPY tsconfig.json package* /srv/crawler/
COPY src /srv/crawler/src

WORKDIR /srv/crawler
RUN npm ci # --production

RUN npm run build
RUN npm prune --production

EXPOSE ${HTTP_PORT}

CMD ["npm", "start" ]

