import * as vscode from "vscode";

// onii chan panel logger
const chan = vscode.window.createOutputChannel('Solana');

export const appendChan = (type: 'ERROR' | 'INFO', msg: string, show?: boolean) => {
  if (show || type === 'ERROR') {
    chan.show();
  }
  chan.append(`[${type} : ${new Date().toLocaleTimeString()}] ${msg} \n`);
};

export default chan;