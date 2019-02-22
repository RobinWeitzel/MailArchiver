FROM node:10

ENV user user
ENV password password
ENV host imap.host.com
ENV port 993
ENV name email

WORKDIR /app

COPY package.json /app
RUN npm install
COPY . /app

CMD node server.js