# FROM node:15.5.0-alpine3.10
FROM alpine-chrome:89-with-node-14

COPY tsconfig.json package* /srv/quizzes/
COPY src /srv/quizzes/src

WORKDIR /srv/quizzes
RUN npm ci

RUN npm run build
RUN npm prune --production

EXPOSE ${PORT}

CMD ["npm", "start" ]

