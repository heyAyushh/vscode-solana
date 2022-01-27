import path = require("path");
import * as vscode from "vscode";
import commands from "./commands";
import checkInstallAnchor from "./helpers/install";
import { registerViews } from "./views";
import { TestItem, TestsProvider } from "./views/tests";

export async function activate(context: vscode.ExtensionContext) {
  // check and install anchor
  checkInstallAnchor();
  registerViews();

  // register commands
  context.subscriptions.push(...commands);
}

// this method is called when your extension is deactivated
export function deactivate() { }
