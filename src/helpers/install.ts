import * as vscode from "vscode";
import chan, { appendChan } from "./outputChannel";
import { spawnChan } from "./spawnExec";
import { checkAvm, installAnchorUsingAvm, installAvm } from "./avm";
import { pwshExec } from "./pwshChan";
import { solanaVersion } from "../constants";
import { solPgMode } from "./config";

export default async function checkInstallAnchor() {
  if (!solPgMode()) {
    try {
      await spawnChan("anchor", ["--version"], "anchor version", "", true);
    } catch (err) {
      // if anchor is not installed
      if (
        err instanceof Error &&
        (err?.message?.includes("not found") ||
          err?.message?.includes("code 127") ||
          // @ts-expect-error windows err in stderr
          err?.stderr?.toString().includes("not recognized"))
      ) {
        // ask user to install anchor
        const selection = await vscode.window.showWarningMessage(
          "Anchor CLI was not found!",
          "Install it",
          "Ignuwu"
        );

        if (selection === "Install it") {
          try {
            try {
              await checkAvm();
            } catch (err) {
              appendChan("INFO", `Installing Anchor version manager...`);
              await installAvm();
            }
            await installAnchorUsingAvm();
          } catch (err) {
            if (err instanceof Error) {
              chan.appendLine(err.message);
              chan.show(true);
            }
          }
        } else {
          chan.appendLine("Anchor CLI was not found and not Installed!");
          chan.show(true);
        }
      }
    }
  }
}

export const checkInstallSolana = async () => {
  if (!solPgMode()) {
    try {
      await spawnChan("solana", ["--version"], "solana version", "", true);
    } catch (err) {
      const version = solanaVersion;
      const isWin = process.platform === "win32";
      const selection = await vscode.window.showWarningMessage(
        "Solana CLI was not found!",
        "Install it",
        "Ignuwu"
      );
      if (selection === "Install it") {
        if (!isWin) {
          vscode.window.withProgress(
            {
              location: vscode.ProgressLocation.Notification,
              title: `Installing Solana ...`,
              cancellable: false,
            },
            async (progress, token) => {
              await spawnChan(
                "sh",
                [
                  "-c",
                  `"$(curl -sSfL https://release.solana.com/${version}/install)"`,
                ],
                "solana install",
                "",
                true
              );
            }
          );
        } else {
          try {
            await vscode.window.withProgress(
              {
                location: vscode.ProgressLocation.Notification,
                title: `Downloading Solana Install toolkit ...`,
                cancellable: false,
              },
              async (progress, token) => {
                await pwshExec(`
                  mkdir 'C:\\solana-install-tmp'
                  $source = 'https://release.solana.com/${version}/solana-install-init-x86_64-pc-windows-msvc.exe'
                  $destination = 'C:\\solana-install-tmp\\solana-install-init.exe'
                  Invoke-WebRequest -Uri $source -OutFile $destination 
                `);
              }
            );
            await vscode.window.withProgress(
              {
                location: vscode.ProgressLocation.Notification,
                title: `Installing Solana ${version} ...`,
                cancellable: false,
              },
              async (progress, token) => {
                await pwshExec(
                  `Start-Process -FilePath "solana-install-init.exe" -ArgumentList "v1.9.11" -WorkingDirectory "C:\\solana-install-tmp"`
                );
              }
            );
          } catch (err) {
            if (err instanceof Error) {
              chan.appendLine(err.message);
              chan.show(true);
            }
          }
        }
      }
    }
  }
};
