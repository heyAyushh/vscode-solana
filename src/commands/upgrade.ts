'use strict';

// import { posix } from 'path';
import * as vscode from 'vscode';
import { spawnChan } from "../helpers/spawnExec";
import { EXT_NAME } from "../config";

const anchorUpgrade = () => vscode.commands.registerCommand(
  `${EXT_NAME}.upgrade`,
  async () => {

    const path = await vscode
      .window
      .showInputBox({
        value: 'target/deploy/program.so',
        placeHolder: 'Enter path to the Program from project root : ./folder/target',
      });
    if (!path) {
      return;
    }

    const id = await vscode
      .window
      .showInputBox({
        placeHolder: 'Enter program id : <44 character public key>',
      });
    if (!id) {
      return;
    }

    vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      title: "Upgrading on chain Anchor ⚓ Program ...",
      cancellable: false
    }, async (progress, token) => {
      spawnChan(`anchor`, ['upgrade', path, '--program-id', id], 'upgrade');
    });
  }
);

export {
  anchorUpgrade,
};
