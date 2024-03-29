import fs from "node:fs";
import path from "node:path";

export class DeployCommands {

    public static extractCommands = (dirname: string, cmdExt: string): any[] => {
        const allFeatures = fs.readdirSync(dirname);
        let myCommand: any[] = [];
        const {fileExt, cmdFileExt} = DeployCommands.getCommandFileExt(cmdExt);
        allFeatures.forEach((folder: string) => {
            if (folder.includes(fileExt)) {
                return;
            }
            const currentFolderPath = path.join(dirname + '/' + folder);
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

    private static getCommandFileExt = (commandExtension: string) => {
        const cmdExt: string = commandExtension;
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
