import { execShell, spawnChan } from "../helpers/spawnExec";
import * as vscode from 'vscode';
import { EXT_NAME } from "../config";
import chan from "../helpers/outputChannel";

const anchorInit = () => vscode.commands.registerCommand(
  `${EXT_NAME}.scaffold`,
  async () => {
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

    if (item && name) {
      if (item === 'init (default)') {
        spawnChan(`anchor init ${name}`, 'Scaffolding Anchor Project');
      } else if ('Synthetify/solana-template') {
        try {
          await execShell(`git clone https://github.com/${item} ${name} && rm -rf ${name}/.git`);
          vscode.window.showInformationMessage(`Anchor ⚓: init Synthetify template completed!`);
        } catch (err) {
          vscode.window.showErrorMessage(`Anchor ⚓: init Synthetify template faled!`);
          if (err instanceof Error) {
            chan.append(err?.message);
            chan.show(true);
          }
        }
      }
    }
  }
);

export {
  anchorInit
};
