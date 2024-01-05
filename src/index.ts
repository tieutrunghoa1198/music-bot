require('module-alias/register');
import {Bot} from "./bot";

Bot.getInstance().start();
process.on('uncaughtException', function (err) {
    console.error(err);
    console.log("Node NOT Exiting...");
    return;
});

