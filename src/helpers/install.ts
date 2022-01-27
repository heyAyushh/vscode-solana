import * as vscode from "vscode";
import chan from "./outputChannel";
import { execShell, spawnChan } from "./spawnExec";
import * as os from 'os';

export const installAnchor = async () => {
  vscode.window.withProgress({
    location: vscode.ProgressLocation.Notification,
    title: "Installing Anchor ⚓ CLI...",
    cancellable: false
  }, async (progress, token) => {
    if (os.arch() === 'x64' && os.type() === 'Linux') {
      spawnChan('npm i -g @project-serum/anchor-cli', 'install');
    } else {
      spawnChan('cargo install --git https://github.com/project-serum/anchor --tag v0.20.1 anchor-cli --locked',
        'build anchor cli from source');
    }
  });
};

export default async function checkInstallAnchor() {
  try {
    await execShell('anchor --version');
  } catch (err) {
    // if anchor is not installed
    if (err instanceof Error && err?.message?.includes("not found")) {
      // ask user to install anchor
      const selection = await vscode
        .window
        .showWarningMessage(
          "Anchor CLI was not found!",
          "Install it",
          "Ignuwu"
        );

      if (selection === "Install it") {
        installAnchor();
      } else {
        chan.appendLine("Anchor CLI was not found and not Installed! ngmi");
        chan.show(true);
      };
    }
  }
}
