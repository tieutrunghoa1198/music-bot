FROM node:16.14.0

WORKDIR usr/src/app

COPY package.json ./

RUN npm install

#ENV TOKEN=
ENV clientId=977523393060560967
ENV guildId=882155251313037332
ENV NODE_ENV=production

COPY . .

CMD node dist/index.js



