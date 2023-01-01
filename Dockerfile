FROM node:16.14.0

WORKDIR usr/src/app

COPY package.json ./

RUN npm install

ENV clientId=977523393060560967
ENV guildId=882155251313037332
ENV NODE_ENV=production
ENV uri=mongodb://172.17.0.3:27017/discord-music-app

COPY . .

CMD node dist/index.js


#docker build . -t tieutrunghoa1198/music-bot
