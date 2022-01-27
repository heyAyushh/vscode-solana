import { exec, spawn } from 'child_process';
import { WORKSPACE_PATH } from "../config";
import * as vscode from "vscode";
import chan from "./outputChannel";

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
*/
export const spawnChan = (cmd: string, registeredAs: string) => {
  try {
    let errorNotifiedFlag = false;
    const cexe = spawn(`${cmd}`, {
      cwd: WORKSPACE_PATH(),
      shell: true,
    });

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
      if (!errorNotifiedFlag || code === 0) {
        vscode.window.showInformationMessage(`Anchor ⚓: ${registeredAs} completed!`);
      } else {
        chan.show(true);
        vscode.window.showErrorMessage(`Anchor ⚓: ${registeredAs} failed!`);
      }
      chan.append(`[INFO : ${new Date().toLocaleTimeString()}] process exited with code ${code} \n`);
    });
  } catch (err) {
    if (err instanceof Error) {
      vscode.window.showErrorMessage(err.message);
    };
  }
};
