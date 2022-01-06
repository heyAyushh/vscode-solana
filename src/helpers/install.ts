import * as vscode from "vscode";
import { exec } from "child_process";

// check anchor version
// ask for installation if not installed
export default function checkInstallAnchor() {
  return exec("anchor --version", (error, stdout, stderr) => {
    if (error) {
      // if anchor is not installed
      if (error?.message?.includes("not found")) {
        // ask user to install anchor
        vscode.window
          .showWarningMessage(
            "Anchor CLI was not found!",
            "Install it",
            "Ignoreuwu"
          )
          .then((selection) => {
            if (selection === "Install it") {
              // add progress notification
              vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "Installing Anchor ⚓ CLI...",
                cancellable: false
              }, (progress, token) => {
                const p = new Promise<void>(
                  resolve => {
                    setTimeout(() =>
                      exec("npm i -g @project-serum/anchor-cli",
                        (error, stdout, stderr) => {
                          if (error) {
                            console.error(`exec error: ${error}`);
                          }
                          resolve();
                        }),
                      5000
                    );
                  }
                );

                return p;
              });
            }
          });
      }

      return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });
}
