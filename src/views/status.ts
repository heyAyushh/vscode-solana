// status bar
// add solpg toggle here

import * as vscode from 'vscode';
import { solPgToggle } from "../commands/solpg";
import { EXT_NAME } from "../constants";
import { solPgMode } from "../helpers/config";
import { checkSolPgLanguageConfig } from "../helpers/solpg";

let solPgBarItem: vscode.StatusBarItem;

const solPgToggleStatus = (context: vscode.ExtensionContext) => {
  context.subscriptions.push(solPgToggle());

  solPgBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  solPgBarItem.command = `${EXT_NAME}.solPgToggle`;
  context.subscriptions.push(solPgBarItem);

  context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(updateSolPgToggleBarItem));

  updateSolPgToggleBarItem(null);
};

async function updateSolPgToggleBarItem(event: vscode.ConfigurationChangeEvent | null) {
  const affected = event?.affectsConfiguration("solana.solPgMode");

  const syncSolPgStatusColor = () => {
    const mode = solPgMode();
    return mode ? '#14F195' : '#9945FF';
  };

  if (affected) {
    solPgBarItem.text = `◎ SolPg`;
    solPgBarItem.color = syncSolPgStatusColor();
    solPgBarItem.show();
  }

  // on initialising status bar pass null
  if (event === null) {

    await checkSolPgLanguageConfig();

    solPgBarItem.text = `◎ SolPg`;
    solPgBarItem.color = syncSolPgStatusColor();
    solPgBarItem.show();
  }
}

export {
  solPgToggleStatus
};