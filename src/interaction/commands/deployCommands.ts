import {REST} from "@discordjs/rest";
import {Routes} from "discord-api-types/v9";
import fs from "node:fs";
import path from "node:path";

export class DeployCommands {
    constructor() {
        this.registerGlobalCommand().then();
    }
    private registerGlobalCommand = async () => {
        const token: any = process.env.TOKEN;
        const clientId: any = process.env.clientId;
        const commands = this.getAllCommands();
        const rest =  new REST({ version: '9' }).setToken(token);
        await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands },
        )
    }

    private getAllCommands = (): any[] => {
        let commands: any = [];
        const myCmd = DeployCommands.extractCommands();
        if (!myCmd.length) {
            console.log('command array is empty -> cannot read')
        }
        myCmd.forEach(command => {
            commands.push(command.data.toJSON())
        })
        return commands;
    }

    public static extractCommands = (): any[] => {
        const allFeatures = fs.readdirSync(__dirname);
        let myCommand: any[] = [];
        const {fileExt, cmdFileExt} = DeployCommands.getCommandFileExt();
        allFeatures.forEach((folder: string) => {
            if (folder.includes(fileExt)) {
                return;
            }
            const currentFolderPath = path.join(__dirname + '/' + folder);
            const folderFiles = fs.readdirSync(currentFolderPath);
            folderFiles.filter(e => {
                if (!e.includes(cmdFileExt)) {
                    return;
                }
                const filePath = path.join(currentFolderPath + '/' + e);
                const module = require(filePath);
                myCommand.push(module.default);
            });
        })
        return myCommand;
    }

    public static getCommandFileExt = () => {
        const cmdExt: string = '.command';
        let cmdFileExt: string;
        let fileExt: string;
        if (process.env.NODE_ENV === 'production') {
            fileExt = '.js'
            cmdFileExt = cmdExt + fileExt;
        } else {
            fileExt = '.ts'
            cmdFileExt = cmdExt + fileExt;
        }
        return {
            fileExt,
            cmdFileExt
        }
    }
}
