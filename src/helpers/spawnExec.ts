import { exec, execSync } from "child_process";
import { spawn } from "./promisify_child_process";
import { getSolanaPath, WORKSPACE_PATH } from "../config";
import * as vscode from "vscode";
import chan, { appendChan } from "./outputChannel";
import { parseCommand } from "./platform";

/**
* probably here to be obselete who knows?
*
* @param cmd - command to be executed
*
*/
export const execShell = (cmd: string) =>
  new Promise<string>((resolve, reject) => {
    exec(cmd, (err, out) => {
      if (err) {
        reject(err);
      }
      return resolve(out);
    });
  });

/**
* uwu spawns command and stweams into anchor extension panewl
*
* @param cmd - command to be executed
* @param registeredAs - name of the command registered in VSCode extension
*
* @returns Promise<ChildProcessOutput | null | undefined>
*/
export const spawnChan = async (
  cmd: string,
  args: string[],
  registeredAs?: string,
  cwd: string = WORKSPACE_PATH(),
  quiet: boolean = false
) => {
  try {
    let errorNotifiedFlag = false;
    cmd = parseCommand(cmd);

    const cexe = spawn(`${cmd}`, args, {
      cwd,
      shell: true,
      env: {
        ...process.env,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        PATH: `${process.env.PATH}:${getSolanaPath()}`
      }
    });

    if (!cexe.stdout || !cexe.stderr) {
      return null;
    }

    cexe.stdout.on('data', (data: unknown) => {
      chan.append(`[INFO : ${new Date().toLocaleTimeString()}] ${data}`);
    });

    cexe.stderr.on('data', (data: string) => {
      if (!errorNotifiedFlag) {
        errorNotifiedFlag = true;
        chan.append(`[ERROR : ${new Date().toLocaleTimeString()}] ${data}`);
      }
      chan.append(`${data}`);
    });

    cexe.on('close', (code: unknown) => {
      if (!quiet) {
        if (!errorNotifiedFlag || code === 0) {
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
      // vscode.window.showErrorMessage(err.message);
      appendChan('ERROR', err.message);
    };
  }
};
