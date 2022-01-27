import * as vscode from 'vscode';
import { EXT_NAME } from "../config";
import checkInstallAnchor from "../helpers/install";
import chan from "../helpers/outputChannel";

export const anchorInstall = () => vscode.commands.registerCommand(
  `${EXT_NAME}.install`,
  async () => {
    try{
      // check and install anchor
      checkInstallAnchor();
    } catch(err) {
      if(err instanceof Error) {
      chan.appendLine(err.message);
      chan.show(true);
    }
  }}
);