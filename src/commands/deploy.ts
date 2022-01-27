import { spawnChan } from "../helpers/spawnExec";
import * as vscode from 'vscode';
import { EXT_NAME } from "../config";

const anchorDeploy = () => vscode.commands.registerCommand(
  `${EXT_NAME}.deploy`,
  async () => {
    vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      title: "Deploying Anchor ⚓ Program ...",
      cancellable: false
    }, async (progress, token) => {
      spawnChan('anchor deploy', 'deploy');
    });
  }
);

export {
  anchorDeploy
};
