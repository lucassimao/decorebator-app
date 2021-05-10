FROM node:15.5.0-alpine3.10

RUN apk add --no-cache udev ttf-freefont chromium git nss freetype harfbuzz ca-certificates
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV CHROMIUM_PATH /usr/bin/chromium-browser

COPY tsconfig.json package* /srv/crawler/
COPY src /srv/crawler/src

WORKDIR /srv/crawler
RUN npm ci # --production

RUN npm run build
RUN npm prune --production

EXPOSE ${PORT}

CMD ["npm", "start" ]

