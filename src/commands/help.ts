import * as vscode from 'vscode';
import { EXT_NAME } from "../constants";

export const anchorHelp = () => vscode.commands.registerCommand(
  `${EXT_NAME}.help`,
  async () => {
    const HELP_ITEMS = [{
      name: 'Anchor Book',
      url: 'https://book.anchor-lang.com'
    }, {
      name: 'Solana Developer Resources',
      url: 'https://solana.com/developers'
    }, {
      name: 'Solana Cookbook',
      url: 'https://solanacookbook.com'
    }, {
      name: 'Sol Dev_',
      url: 'https://soldev.app/'
    }];

    const item = await vscode
      .window
      .showQuickPick(HELP_ITEMS.map(it => it.name), {
        placeHolder: 'Where you wanna go?',
      });

    if (!item) {
      return;
    }

    const url = HELP_ITEMS.find(it => it.name === item)?.url as string;
    vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(url));
  }
);
