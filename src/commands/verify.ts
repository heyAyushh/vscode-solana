import { spawnChan } from "../helpers/spawnExec";
import * as vscode from 'vscode';
import { EXT_NAME, WORKSPACE_PATH } from "../config";
import { checkCliInstalled } from "../helpers/install";
import * as path from 'path';
import chan, { appendChan } from "../helpers/outputChannel";
import { parse } from '@ltd/j-toml';
import { readFileSync } from "fs";

// TODO: Tick programs if verified, and copy hash to clipboard button, Build if not built
const anchorVerify = (programName?: string) => vscode.commands.registerCommand(
  `${EXT_NAME}.verify`,
  async () => {
    if (!await checkCliInstalled('solana-verify')) {
      const install = await vscode.window.showInformationMessage(
        'solana-verify is not installed. Would you like to install it?',
        'Yes', 'No'
      );
      if (install === 'Yes') {
        await spawnChan('cargo', ['install', 'solana-verify'], 'Install solana-verify');
        appendChan('INFO', 'solana-verify installed successfully.');
      } else {
        return;
      }
    }

    if (programName) {
      const programPath = path.join(WORKSPACE_PATH(), 'programs', programName);
      appendChan('INFO', `Verifying program: ${programName}`);
      const cargoToml = parse(
        readFileSync(path.join(programPath, 'Cargo.toml'), 'utf-8')
      );
      // @ts-expect-error
      const programLibName = cargoToml.lib?.name;

      vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "Getting executable hash...",
        cancellable: false
      }, async (progress, token) => {
        const result = await spawnChan('solana-verify', ['build', '--library-name', programLibName], 'Get executable hash');
        if (result && result.stdout) {
          const hash = result.stdout.toString().trim();
          vscode.window.showInformationMessage(`Executable hash: ${hash}`);
          await vscode.env.clipboard.writeText(hash);
          vscode.window.showInformationMessage('Hash copied to clipboard');
          appendChan('INFO', `Executable hash for ${programName}: ${hash}`);
        } else {
          appendChan('ERROR', `Failed to get executable hash for ${programName}`);
        }
      });
    } else {
      const programPath = path.join(WORKSPACE_PATH());
      appendChan('INFO', `Verifying program: ${programName}`);

      vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "Getting executable hash...",
        cancellable: false
      }, async (progress, token) => {
        const result = await spawnChan('solana-verify', ['build', '--library-name'], 'Get executable hash');
        if (result && result.stdout) {
          const hash = result.stdout.toString().trim();
          vscode.window.showInformationMessage(`Executable hash: ${hash}`);
          await vscode.env.clipboard.writeText(hash);
          vscode.window.showInformationMessage('Hash copied to clipboard');
          appendChan('INFO', `Executable hash for ${programName}: ${hash}`);
        } else {
          appendChan('ERROR', `Failed to get executable hash for ${programName}`);
        }
      });
    }
  }
);

const getExecutableHash = async (programName: string): Promise<string | undefined> => {
  const programPath = path.join(WORKSPACE_PATH(), 'programs', programName, 'target', 'deploy', `${programName}.so`);
  try {
    const result = await spawnChan('solana-verify', ['get-executable-hash', programPath], 'Get executable hash');
    return result?.stdout?.toString().trim();
  } catch (error) {
    console.error('Error getting executable hash:', error);
    return undefined;
  }
};

const copyHashToClipboard = async (programName: string) => {
  const hash = await getExecutableHash(programName);
  if (hash) {
    await vscode.env.clipboard.writeText(hash);
    vscode.window.showInformationMessage(`Executable hash for ${programName} copied to clipboard`);
  } else {
    vscode.window.showErrorMessage(`Failed to get executable hash for ${programName}. Please build the program with Solana Verify enabled.`);
  }
};

export {
  anchorVerify,
  copyHashToClipboard
};
