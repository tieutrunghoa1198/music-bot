import {Bot} from "./struct/bot";

const bot = new Bot();
bot.start();

process.on('uncaughtException', function (err) {
    console.error(err);
    console.log("Node NOT Exiting...");
    return;
});

