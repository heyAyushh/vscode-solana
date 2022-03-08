import { ExtensionContext } from "vscode";
import commands from "./commands";
import checkInstallAnchor, { checkInstallSolana } from "./helpers/install";
import { registerViews } from "./views";

export async function activate(context: ExtensionContext) {
  registerViews();
  await checkInstallSolana();
  await checkInstallAnchor();

  // register commands
  context.subscriptions.push(...commands);
}

// this method is called when your extension is deactivated
export function deactivate() { }
