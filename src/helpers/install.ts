import * as vscode from "vscode";
import chan, { appendChan } from "./outputChannel";
import { spawnChan } from "./spawnExec";
import { checkAvm, installAnchorUsingAvm, installAvm } from "./avm";
import { pwshExec } from "./pwshChan";
import { solanaVersion } from "../config";
import { execa } from 'execa';

export async function checkCliInstalled(cli: string): Promise<boolean> {
  try {
    await execa(cli, ['--version']);
    return true;
  } catch (error) {
    return false;
  }
}

export async function promptInstallation(cli: string): Promise<boolean> {
  const selection = await vscode.window.showWarningMessage(
    `${cli} CLI was not found!`,
    "Install it",
    "Ignore"
  );
  return selection === "Install it";
}

export async function installAnchor(): Promise<void> {
  try {
    await checkAvm();
  } catch (err) {
    appendChan("INFO", `Installing Anchor version manager...`);
    await installAvm();
  }
  await installAnchorUsingAvm();
}

export async function installSolana(): Promise<void> {
  const version = solanaVersion;
  const isWin = process.platform === "win32";

  if (!isWin) {
    await vscode.window.withProgress(
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
            `"$(curl -sSfL https://release.anza.xyz/${version}/install)"`,
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
            $source = 'https://release.anza.xyz/${version}/solana-install-init-x86_64-pc-windows-msvc.exe'
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

export async function installCli(cli: string): Promise<void> {
  switch (cli) {
    case 'anchor':
      await installAnchor();
      break;
    case 'solana':
      await installSolana();
      break;
    default:
      throw new Error(`Installation for ${cli} is not supported.`);
  }
}

export async function checkAndInstallCli(cli: string): Promise<boolean> {
  if (await checkCliInstalled(cli)) {
    return true;
  }

  if (await promptInstallation(cli)) {
    await installCli(cli);
    return await checkCliInstalled(cli);
  }

  return false;
}

export async function checkInstallAnchor(): Promise<void> {
  try {
    await checkAndInstallCli('anchor');
  } catch (err) {
    if (err instanceof Error) {
      chan.appendLine(err.message);
      chan.show(true);
    }
  }
}

export async function checkInstallSolana(): Promise<void> {
  try {
    await checkAndInstallCli('solana');
  } catch (err) {
    if (err instanceof Error) {
      chan.appendLine(err.message);
      chan.show(true);
    }
  }
}