import * as vscode from "vscode";
import commands from "./commands";
import checkInstallAnchor from "./helpers/install";

export async function activate(context: vscode.ExtensionContext) {
  // check and install anchor
  checkInstallAnchor();

  // register commands
  context.subscriptions.push(...commands);
}

// this method is called when your extension is deactivated
export function deactivate() { }
