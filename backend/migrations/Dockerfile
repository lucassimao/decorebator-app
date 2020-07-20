FROM node:14.3.0-alpine

ARG GITHUB_TOKEN
RUN npm config set @lucassimao:registry https://npm.pkg.github.com/lucassimao
RUN npm config set //npm.pkg.github.com/:_authToken $GITHUB_TOKEN

COPY package* /srv/migrations/
WORKDIR /srv/migrations
RUN npm ci --production

CMD ["npx", "sequelize-cli","db:migrate" ]

