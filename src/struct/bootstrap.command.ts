require('dotenv').config()
import {DeployCommands} from "../mvc/controllers/command/deployCommands";
export const bootstrapCommand = async () => {
    try {
        new DeployCommands();
    } catch (e) {
        console.log(e, 'Error: at bootstrapCommand.ts');
    }
};
