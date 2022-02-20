import * as vscode from 'vscode';
import { EXT_NAME } from "../config";
import chan from "../helpers/outputChannel";
import { checkAvm, installAnchorUsingAvm, installAvm } from "../helpers/avm";

export const anchorInstall = () => vscode.commands.registerCommand(
  `${EXT_NAME}.install`,
  async () => {
    try{
      try {
        await checkAvm();
      } catch (err) {
        await installAvm();
      } finally {
        await installAnchorUsingAvm();
      }
    } catch(err) {
      if(err instanceof Error) {
      chan.appendLine(err.message);
      chan.show(true);
    }
  }}
);