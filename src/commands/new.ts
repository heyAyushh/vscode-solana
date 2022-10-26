import { spawnChan } from "../helpers/spawnExec";
import * as vscode from 'vscode';
import { EXT_NAME } from "../constants";

const anchorNew = () => vscode.commands.registerCommand(
  `${EXT_NAME}.new`,
  async () => {
    const name = await vscode
      .window
      .showInputBox({
        placeHolder: 'Enter program name: <nft sama>',
      });

    if (name) {
      vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "Creating new Anchor ⚓ Program ...",
        cancellable: false
      }, async (progress, token) => {
        spawnChan(`anchor`, ['new', name], 'new program');
      });
    }
  }
);

export {
  anchorNew,
};
