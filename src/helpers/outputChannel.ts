import * as vscode from "vscode";

// onii chan panel logger
const chan = vscode.window.createOutputChannel('Anchor');

export const appendChan = (type: 'ERROR' | 'INFO', msg: string) =>
  chan.append(`[${type} : ${new Date().toLocaleTimeString()}] ${msg}`);

export default chan;