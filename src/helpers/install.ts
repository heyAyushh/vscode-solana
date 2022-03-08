import * as vscode from "vscode";
import chan, { appendChan } from "./outputChannel";
import { spawnChan } from "./spawnExec";
import { checkAvm, installAnchorUsingAvm, installAvm } from "./avm";
import pwshChan from "./pwshChan";

export default async function checkInstallAnchor() {
  try {
    await spawnChan('anchor', ['--version'], 'anchor version', '', true);
  } catch (err) {
    // if anchor is not installed
    if (err instanceof Error &&
      (err?.message?.includes("not found") || err?.message?.includes("code 127"))) {
      // ask user to install anchor
      const selection = await vscode
        .window
        .showWarningMessage(
          "Anchor CLI was not found!",
          "Install it",
          "Ignuwu"
        );

      if (selection === "Install it") {
        try {
          try {
            await checkAvm();
          } catch (err) {
            appendChan('INFO', `Installing Anchor version manager...`);
            await installAvm();
          }
          await installAnchorUsingAvm();
        } catch (err) {
          if (err instanceof Error) {
            chan.appendLine(err.message);
            chan.show(true);
          };
        }
      } else {
        chan.appendLine("Anchor CLI was not found and not Installed! ngmi");
        chan.show(true);
      };
    }
  }
}

export const checkInstallSolana = async () => {
  try {
    await spawnChan('solana', ['--version'], 'solana version', '', true);
  } catch (err) {
    const version = 'v1.9.9';
    const isWin = process.platform === "win32";

    if (!isWin) {
      vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: `Installing Solana ...`,
        cancellable: false
      }, async (progress, token) => {
        await spawnChan('sh', ['-c', `"$(curl -sSfL https://release.solana.com/v1.9.9/install)"`], 'solana install', '', true);
      });
    } else {
      const exeFile = 'solana-install-init-x86_64-pc-windows-msvc.exe';
      const SOLANA_RELEASE_URL = 'https://release.solana.com';
      const tmpPath = 'C:\solana-install-tmp\solana-install-init.exe';

      vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: `Downloading Solana Install toolkit ...`,
        cancellable: false
      }, async (progress, token) => {
        await pwshChan('curl', [`${SOLANA_RELEASE_URL}/${version}/${exeFile}`, '--output', tmpPath, '--create-dirs'], 'solana install', '', true);
      }).then(() =>
        vscode.window.withProgress({
          location: vscode.ProgressLocation.Notification,
          title: `Installing Solana ${version} ...`,
          cancellable: false
        }, async (progress, token) => {
          await pwshChan('curl', [`${SOLANA_RELEASE_URL}/${version}/${exeFile}`, '--output', tmpPath, '--create-dirs'], 'solana install', '', true);
        })
      );
    }
  }
};