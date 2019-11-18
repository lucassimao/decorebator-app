FROM nikolaik/python-nodejs:python2.7-nodejs13

COPY package.json /srv/auth/
COPY package-lock.json /srv/auth/
WORKDIR /srv/auth

RUN npm install
RUN npm install -g nodemon

COPY src /srv/auth/src

EXPOSE ${HTTP_PORT}

CMD ["npm","start"] 
