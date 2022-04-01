import * as vscode from "vscode";
import { EXT_NAME } from "../config";
import chan from "../helpers/outputChannel";
import { checkAvm, installAnchorUsingAvm, installAvm } from "../helpers/avm";
import { checkInstallSolana } from "../helpers/install";

export const anchorInstall = () =>
  vscode.commands.registerCommand(`${EXT_NAME}.install`, async () => {
    try {
      try {
        await checkAvm();
      } catch (err) {
        await installAvm();
      } finally {
        await installAnchorUsingAvm();
      }
    } catch (err) {
      if (err instanceof Error) {
        chan.appendLine(err.message);
        chan.show(true);
      }
    }
  });

export const solanaInstall = () =>
  vscode.commands.registerCommand(`${EXT_NAME}.solanaInstall`, async () => {
    try {
      await checkInstallSolana();
    } catch (err) {
      if (err instanceof Error) {
        chan.appendLine(err.message);
        chan.show(true);
      }
    }
  });
