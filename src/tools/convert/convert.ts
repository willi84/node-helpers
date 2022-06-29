import { LOG, LogType } from './../log/log';
const log = new LOG();

export const round = (wert, dez = 0) =>  {
    wert = parseFloat(wert);
    // if (!wert) { return 0; } // TODO: why was this line
    const umrechnungsfaktor = Math.pow(10, dez);
    let result = Math.round(wert * umrechnungsfaktor) / umrechnungsfaktor;
    return result;
};
export const roundToString = (wert, dez, fillZero = false) =>  {
    const result = round(wert, dez);
    return result.toFixed(dez) ;
}
// export const bytesToKB = () => {}
// export const mdToJSON = () => {}
export const stringToJSON = (fileStream: string) => {
    let data;
    let str = fileStream.toString();
    let hasError = false;
    try{
        JSON.parse(str);
    } catch(e){
        hasError = true;
        log.WARN(`json is invalid: ${e}`);
    }
    // fix missing keys strings
    // { 'key': value}  ==> { "key": value}
    str = str.replace(/([\{|\,])(\s*)\'([^\']*)\'*(\s*):/ig, '$1$2"$3"$4:')
    // { key: value}  ==> { 'key': value}
    str = str.replace(/([\{|\,])(\s*)([^\"|\']*)*(\s*):/ig, '$1$2"$3"$4:')

    // TODO: value has '
    data = JSON.parse(str.toString());
    // str.match(//);

    // TODO unexpected when key is not a string


    //  Unexpected token ' in JSON at position 47
    return data;

}