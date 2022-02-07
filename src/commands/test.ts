import { spawnChan } from "../helpers/spawnExec";
import * as vscode from 'vscode';
import { EXT_NAME } from "../config";

const anchorTest = () => vscode.commands.registerCommand(
  `${EXT_NAME}.test`,
  async () => {
    vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      title: "Anchor ⚓: Starting Tests...",
      cancellable: false
    }, async (progress, token) => {
      spawnChan('anchor',['test'], 'test');
    });
  }
);

export {
  anchorTest,
};