FROM node:12.9.1-alpine

ARG VERDACCIO_URL

COPY src /home/common
COPY package.json /home/common
COPY package-lock.json /home/common
COPY publish.sh /home/common
RUN ["chmod","+x","/home/common/publish.sh"]


RUN npm install -g npm-cli-login

ENV NPM_USER common
ENV NPM_PASS 123
ENV NPM_EMAIL common@decorebator.com
ENV NPM_REGISTRY $VERDACCIO_URL

WORKDIR /home/common

CMD ["./publish.sh"]
