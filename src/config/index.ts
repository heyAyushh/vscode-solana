import { execSync } from "child_process";
import * as vscode from "vscode";
import { isLinux, isMac } from "../helpers/platform";

export const EXT_NAME = "vscode-anchor";

export const WORKSPACE_PATH = () => {
  if (vscode?.workspace?.workspaceFolders) {
    return vscode?.workspace?.workspaceFolders[0].uri.fsPath;
  } else {
    throw new Error(
      "not in workspace! please open Anchor folder in vscode workspace first!"
    );
  }
};

export const configuration = vscode.workspace.getConfiguration("vscode-anchor");

export const home = execSync("echo $HOME");
export const solanaBinPath = configuration.get("vscode-anchor.solanaBinPath");

export const getSolanaPath = () => {
  let path = configuration.get("vscode-anchor.solanaBinPath");
  if (!path) {
    if (isLinux || isMac) {
      path = `${home.toString().replace("\n", "")}/.local/share/solana/install/active_release/bin`;
      configuration.update("vscode-anchor.solanaBinPath", path, true);
    } else {
      path = `${home.toString().replace("\n", "")}\\.local\\share\\solana\\install\\active_release\\bin`;
      configuration.update("vscode-anchor.solanaBinPath", path, true);
    }
  }

  return path;
};

export const solanaVersion = "v1.9.13";