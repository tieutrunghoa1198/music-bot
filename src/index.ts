import {Bot} from "./bot";

new Bot().start();
process.on('uncaughtException', function (err) {
    console.error(err);
    console.log("Node NOT Exiting...");
    return;
});

