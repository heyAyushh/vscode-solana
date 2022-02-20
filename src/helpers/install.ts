import * as vscode from "vscode";
import chan, { appendChan } from "./outputChannel";
import { spawnChan } from "./spawnExec";
import { checkAvm, installAnchorUsingAvm, installAvm } from "./avm";

export default async function checkInstallAnchor() {
  try {
    await spawnChan('anchor', ['--version'], 'anchor version', '', true);
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
