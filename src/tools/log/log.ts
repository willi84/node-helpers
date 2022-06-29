import { colors } from './../colors'
// TODO: move to other file
import * as os  from 'os';
// const isMicrosoft = os.release().toLocaleLowerCase().includes('microsoft');
// const hasLinuxPlattform = process.platform.includes('linux');
// const isVSCode = (process.env.TERM_PROGRAM && process.env.TERM_PROGRAM.includes('vscode'));
// let noEmojis = isMicrosoft && hasLinuxPlattform && (!isVSCode);
// https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color

export enum LogType {
    OK = 'OK',
    FAIL = 'FAIL',
    WARN = 'WARN',
    NEWLINE = 'NEWLINE',
    INFO = 'INFO',
    DEFAULT = 'DEFAULT',
    INLINE = 'INLINE',
  }


export class LOG {
    icon = '';
    types = {
        [LogType.INLINE]        : { status: '', fg: colors.FgWhite, bg: colors.BgBlack},
        [LogType.OK]        : { status: '[OK]', fg: colors.FgWhite, bg: colors.BgGreen},
        [LogType.FAIL]      : { status: '[FAIL]', fg: colors.FgWhite, bg: colors.BgRed} ,
        [LogType.WARN]      : { status: '[WARN]', fg: colors.FgWhite, bg: colors.BgYellow} ,
        [LogType.DEFAULT]   : { status: '      ', fg: colors.FgWhite, bg: colors.BgBlack},
        [LogType.INFO]      : { status: '[INFO]', fg: colors.FgBlack, bg: colors.BgWhite},
    }
    private output(type, message, icon, newline){
        const color = this.types[type];
        const status = (type === LogType.INLINE) ? `` : `${color.fg}${color.bg}  ${color.status}  ${colors.Reset} `;
        process.stdout.write(`${newline ? '\n' : ''}${status}${icon}${message}`);
    }
    OK (message: string, newline = true){ this.output(LogType.OK, message, this.icon, newline) }
    FAIL (message: string, newline = true){  this.output(LogType.FAIL, message, this.icon, newline) }
    WARN (message: string, newline = true){  this.output(LogType.WARN, message, this.icon, newline) }
    INFO (message: string, newline = true){  this.output(LogType.INFO, message, this.icon, newline) }
    DEFAULT (message: string, newline = true){  this.output(LogType.DEFAULT, message, this.icon, newline) }
    INLINE(message: string){ this.output(LogType.INLINE, message, this.icon, false)}
}