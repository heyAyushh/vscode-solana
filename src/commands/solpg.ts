import * as vscode from 'vscode';
import { EXT_NAME } from "../constants";
import { solPgMode } from "../helpers/config";
import chan, { appendChan } from "../helpers/outputChannel";

const solPgToggle = () => vscode.commands.registerCommand(
  `${EXT_NAME}.solPgToggle`,
  async () => {
    const solpg = solPgMode();
    const toggled = !solpg;

    const config = vscode.workspace.getConfiguration('solana');
    config.update('solPgMode', toggled);

    appendChan('INFO', `solPg Mode ${toggled ? 'ON' : 'OFF'}`);
    vscode.window.showInformationMessage(`solPg Mode ${toggled ? 'ON' : 'OFF'}`);
  }
);

export {
  solPgToggle
};
