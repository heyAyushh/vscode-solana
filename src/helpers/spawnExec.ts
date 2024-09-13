import { execa, ResultPromise } from 'execa';
import * as vscode from "vscode";
import chan, { appendChan } from "./outputChannel";
import { parseCommand } from "./platform";
import { WORKSPACE_PATH } from "../config";
import { checkCliInstalled } from './install';

/**
 * Spawns a command and streams output into the Anchor extension panel
 *
 * @param cmd - command to be executed
 * @param args - arguments for the command
 * @param registeredAs - name of the command registered in VSCode extension
 * @param cwd - current working directory
 * @param quiet - if true, don't show notifications
 * @param showOutput - if true, show output in the terminal
 * @param progress - progress object for the progress bar
 *
 * @returns Promise<ExecaChildProcess | null>
 */
export const spawnChan = async (
  cmd: string,
  args: string[],
  registeredAs?: string,
  cwd: string = WORKSPACE_PATH(),
  quiet: boolean = false,
  showOutput: boolean = false,
  progress?: vscode.Progress<{ message?: string; increment?: number }>
): Promise<ResultPromise | null> => {
  try {
    if (!await checkCliInstalled(cmd)) {
      return null;
    }

    if (showOutput) {
      chan.show(true);
    }

    if (progress) {
      progress.report({ message: `Running ${registeredAs}...`, increment: 0 });
    }

    cmd = parseCommand(cmd);

    const cexe = execa(cmd, args, {
      cwd,
      env: {
        ...process.env,
        PATH: `${process.env.PATH}:${process.env.HOME}/.local/share/solana/install/active_release/bin`
      },
      shell: true,
    });

    if (!cexe.stdout || !cexe.stderr) {
      return null;
    }

    cexe.stdout.on('data', (data: Buffer) => {
      chan.append(`[INFO : ${new Date().toLocaleTimeString()}] ${data.toString()}`);
      if (progress) {
        progress.report({ message: data.toString(), increment: 1 });
      }
    });

    cexe.stderr.on('data', (data: Buffer) => {
      chan.append(`[ERROR : ${new Date().toLocaleTimeString()}] ${data.toString()}`);
    });

    cexe.on('close', (code: number | null) => {
      if (progress) {
        progress.report({ message: `${registeredAs} completed`, increment: 100 });
      }
      if (!quiet) {
        if (code === 0) {
          vscode.window.showInformationMessage(`Anchor ⚓: ${registeredAs} completed!`);
        } else {
          chan.show(true);
          vscode.window.showErrorMessage(`Anchor ⚓: ${registeredAs} failed!`);
        }
      }
      chan.append(`[INFO : ${new Date().toLocaleTimeString()}] process exited with code ${code} \n`);
    });

    return cexe;
  } catch (err) {
    if (err instanceof Error) {
      appendChan('ERROR', err.message);
      if (showOutput) {
        chan.show(true);  // Show the channel if there's an error
      }
    }
    return null;
  }
};
