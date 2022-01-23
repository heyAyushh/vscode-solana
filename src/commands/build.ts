import { spawnChan } from "../helpers/spawnExec";
import * as vscode from 'vscode';
import { EXT_NAME } from "../config";

const anchorBuild = () => vscode.commands.registerCommand(
  `${EXT_NAME}.build`,
  async () => {
    vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      title: "Building Anchor ⚓ Program ...",
      cancellable: false
    }, async (progress, token) => {
      spawnChan('anchor build', 'build');
    });
  }
);

const anchorBuildVerifiable = () => vscode.commands.registerCommand(
  `${EXT_NAME}.buildVerifiable`,
  async () => {
    vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      title: "Building verifiable Anchor ⚓ CLI...",
      cancellable: false
    }, async (progress, token) => {
      spawnChan('anchor build --verifiable', 'build');
    });
  }
);

const anchorRemoveDockerImage = () => vscode.commands.registerCommand(
  `${EXT_NAME}.removeDockerImage`,
  async () => {
    vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      title: "Removing Docker image Anchor ⚓ CLI...",
      cancellable: false
    }, async (progress, token) => {
      spawnChan('docker rm -f anchor-program', 'remove Docker Image');
    });
  }
);

export {
  anchorBuild,
  anchorBuildVerifiable,
  anchorRemoveDockerImage,
};
