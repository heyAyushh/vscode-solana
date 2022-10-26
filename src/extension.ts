import { ExtensionContext } from "vscode";
import commands from "./commands";
import checkInstallAnchor, { checkInstallSolana } from "./helpers/install";
import { registerViews } from "./views";
import { solPgToggleStatus } from "./views/status";

export async function activate(context: ExtensionContext) {
  registerViews();
  await checkInstallSolana();
  await checkInstallAnchor();

  solPgToggleStatus(context);

  // register commands
  context.subscriptions.push(...commands);
}

// this method is called when your extension is deactivated
export function deactivate() { }
