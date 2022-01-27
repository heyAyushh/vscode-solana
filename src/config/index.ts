import * as vscode from 'vscode';

export const EXT_NAME = 'vscode-anchor';

export const WORKSPACE_PATH = () => {
  if (vscode?.workspace?.workspaceFolders) {
    return vscode?.workspace?.workspaceFolders[0].uri.fsPath;
  } else {
    throw new Error('not in workspace! please open Anchor folder in vscode workspace first!');
  }
};
