import * as vscode from "vscode";
import checkInstallAnchor from "./helpers/install";

export async function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "vscode-anchor" is now active!');

  checkInstallAnchor();

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "vscode-anchor.helloWorld",
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage("Hello World from vscode-anchor!");
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
