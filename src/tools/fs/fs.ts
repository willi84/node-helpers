import * as convert from './../convert/convert';
import { LOG, LogType } from './../log/log';
const log = new LOG();
const { execSync } = require('child_process');
import path from 'path';

import * as fs from 'fs'

export enum Status {
    ERROR = -1,
    REMOVED = 0,
    CREATED = 1,
    ALREADY_EXISTS = 2,
    NOT_EXISTS = 3,
    NOT_EMPTY = 4,
    OVERWRITTEN = 5,
    EXTENDED = 6,
}

interface LogStatusEnumInstance {
    status: Status,
    logType: LogType,
    message: string
}
interface FolderLogStatusEnum {
    [key: string]: LogStatusEnumInstance
}
export const FolderLogStatus: FolderLogStatusEnum = {
    ERROR:          { logType: LogType.FAIL, status: Status.ERROR, message: `folder not exists` },
    ALREADY_EXISTS: { logType: LogType.WARN, status: Status.ALREADY_EXISTS, message: `folder already exists` },
    CREATED:        { logType: LogType.INFO, status: Status.CREATED, message: `path created` },
    NOT_EXISTS:     { logType: LogType.WARN, status: Status.NOT_EXISTS, message: `folder not exists` },
    NOT_EMPTY:      { logType: LogType.WARN, status: Status.NOT_EMPTY, message: `folder not empty` },
    REMOVED:        { logType: LogType.INFO, status: Status.REMOVED,  message: `folder is removed` },
};

// todo: handle read path on linux and windows
// TODO: reutnr direct data or diagnostics (log or status)
// TODO: home path
// TODO: utf-8 or other types

// https://stackoverflow.com/a/54387221
const getAllFiles = dir =>
    fs.readdirSync(dir).reduce((files, file) => {
        const name = path.join(dir, file);
        const isDirectory = fs.statSync(name).isDirectory();
        return isDirectory ? [...files, ...getAllFiles(name)] : [...files, name];
    }, []);

export class FS {
    private _log(logStatus: LogStatusEnumInstance, showLog): Status{
        if(showLog) { log[`${logStatus.logType}`](logStatus.message)};
        return logStatus.status;
    }
    hasFolder(path) {
        return fs.existsSync(path);
    }
    createFolder(path:string, showLog = false): Status{
        let status;
        if(!this.hasFolder(path)){
            fs.mkdirSync(path); // create folder
            status = this.hasFolder(path) ? FolderLogStatus.CREATED : FolderLogStatus.ERROR;
        } else {
            status = FolderLogStatus.ALREADY_EXISTS;
        }
        return this._log(status, showLog);
    }
    // TODO: try/catch
    removeFolder(path:string, recursive = true, showLog = false): Status{
        let status;
        if(fs.existsSync(path) === false){
            status = FolderLogStatus.NOT_EXISTS;
        } else {
            if(recursive){
                fs.rmdirSync(path, { recursive: recursive });
                status = FolderLogStatus.REMOVED;
            } else {
                const files = fs.readdirSync(path);
                if(files.length !== 0){
                    status = FolderLogStatus.NOT_EMPTY;
                } else {
                    fs.rmdirSync(path, { recursive: recursive });
                    status = FolderLogStatus.REMOVED;
                }
            }
        }
        return this._log(status, showLog);
    }
    // createFile(){}
    writeFile(path: string, data: any, overwrite = false, check = true){
        // todo checksum 
        // todo encoding
        const FLAG = overwrite === true ? 'a+' : 'w+';
        let alreadyExists = false;
        let status: Status;
        if(fs.existsSync(path) === true){
            alreadyExists = true;
        }
        let content = typeof data === 'string' ? data : JSON.stringify(data);
        try{
            fs.writeFileSync(path, content, {'flag': FLAG});
            // TODO: implement content change check with hash or string
            status = alreadyExists === true ? overwrite ? Status.EXTENDED :  Status.OVERWRITTEN : Status.CREATED;
        } catch(e){
            // console.log(e);  //TODO
        }
        return {status: status}
    }
    // with path and with or without empty folder
    // recursive
    list(path: string, recursive = false, fullPath = true){
        let pathExits = true;
        let result = [];
        // TODO: recursive true
        if(!fs.existsSync(path)){
            pathExits = false;
        } else {
            try{
                // result = fs.readdirSync(path);
                // https://stackoverflow.com/questions/2727167/how-do-you-get-a-list-of-the-names-of-all-files-present-in-a-directory-in-node-j
                result = getAllFiles(path);

            } catch(e){
                // console.log(e);  //TODO
            }
        }
        return result;
    }
    // type by name or returnType
    readFile(path: string, type = 'string'){
        let data;
        // TODO: encoding
        // TODO: errors
        // TODO: different return types
        // TODO: avoid code exection
        // TODO: define character sets
        const isJSON = path.indexOf('.json') !== -1;

        // TODO: try/catch => e.g. if cannot readed or accessed
        const fileStream = fs.readFileSync(path);

        let str = fileStream.toString();
        if(isJSON){
            data = convert.stringToJSON(str);
        } else {
            data = str;
        }
        return { data: data, status: 1 };
    }
    
    size(name, value) {
        if (typeof value === 'object'){ value = JSON.stringify(value); }
        const size = Buffer.from(value).length;
        // const str = name !== '' ? `size of  ${name} is` : '';
        return size;
        // return `${str} ${Round(size / 1024, 2)} kb (${size} B)`;
        // LOG('OK', `size of  ${name} is ${round(size /1024,2)} kb (${size} B)`, '💾')
    }
}



// TODO: fs async
// TODO: folder size, size of file