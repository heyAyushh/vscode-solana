import { spawnChan } from "../helpers/spawnExec";
import * as vscode from 'vscode';
import { EXT_NAME } from "../config";
import chan, { appendChan } from "../helpers/outputChannel";
import path = require("path");

const anchorInit = () => vscode.commands.registerCommand(
  `${EXT_NAME}.scaffold`,
  async () => {
    try {
      const item = await vscode
        .window
        .showQuickPick(['init (default)', 'Synthetify/solana-template'], {
          placeHolder: 'init or synthetify template',
        });
      if (!item) {
        return;
      }

      const name = await vscode
        .window
        .showInputBox({
          placeHolder: 'Enter Project name: <uwu defi>',
        });
      if (!name) {
        return;
      }

      const options: vscode.OpenDialogOptions = {
        canSelectMany: false,
        openLabel: 'Select root of scaffold project',
        canSelectFiles: false,
        canSelectFolders: true
      };
      const cwd = await vscode
        .window
        .showOpenDialog(options);
      if (!cwd || !cwd[0]) {
        return;
      }

      if (item === 'init (default)') {
        await spawnChan(`anchor`, ['init', name], 'Scaffolding Anchor Project', cwd[0].fsPath);
      } else if (item === 'Synthetify/solana-template') {
        try {
          await spawnChan(`npx`, ['degit', `https://github.com/${item}`, name], 'Scaffolding Anchor Project', cwd[0].fsPath);
        } catch (err) {
          vscode.window.showErrorMessage(`Anchor ⚓: init Synthetify template failed!`);
          if (err instanceof Error) {
            chan.append(err?.message);
            chan.show(true);
          }
        }
      }

      const openInWorkspace = await vscode
        .window
        .showWarningMessage('Jump into the Anchor project?', 'yesss lfg', 'later maybe');

      if (openInWorkspace === 'yesss lfg') {
        const uri = vscode.Uri.file(path.join(`${cwd[0].fsPath}`,`${name}`));
        await vscode.commands.executeCommand('vscode.openFolder', uri);
        await vscode.window.showInformationMessage(`Anchor ⚓: Jumping to your ${name} anchor project!`);
      }

      return true;
    } catch (err) {
      if (err instanceof Error) {
        chan.show(true);
        appendChan('ERROR', err?.message);
      };
      return false;
    }
  }
);

export {
  anchorInit
};
