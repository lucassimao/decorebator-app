FROM node:15.5.0-alpine3.10

COPY newrelic.js tsconfig.json package* /srv/quizzes/
WORKDIR /srv/quizzes
RUN npm ci

COPY src /srv/quizzes/src

RUN npm run build
RUN npm prune --production

EXPOSE ${PORT}

CMD ["npm", "start" ]

