import { ExtensionContext } from "vscode";
import commands from "./commands";
import checkInstallAnchor from "./helpers/install";
import { registerViews } from "./views";

export async function activate(context: ExtensionContext) {
  // check and install anchor
  checkInstallAnchor();
  registerViews();

  // register commands
  context.subscriptions.push(...commands);
}

// this method is called when your extension is deactivated
export function deactivate() { }
