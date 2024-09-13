import { ExtensionContext, Disposable } from "vscode";
import commands from "./commands";
import { checkCliInstalled } from "./helpers/install";
import { registerViews } from "./views";

let disposables: Disposable[] = [];

export async function activate(context: ExtensionContext) {
  // Register views and store disposables
  disposables = disposables.concat(registerViews(context));
  
  // Check for CLI installations
  await checkCliInstalled('solana');
  await checkCliInstalled('anchor');

  // Register commands and store disposables
  disposables = disposables.concat(commands);

  // Add all disposables to the context subscriptions
  context.subscriptions.push(...disposables);
}

export function deactivate() {
  // Dispose of all registered disposables
  disposables.forEach(disposable => disposable.dispose());
  disposables = [];
}