import { spawnChan } from "../helpers/spawnExec";
import * as vscode from 'vscode';
import { EXT_NAME, WORKSPACE_PATH } from "../config";
import { getDirectories } from "../helpers/util";
import path = require("path");
import chan from "../helpers/outputChannel";
import { ProgramItem } from "../views/programs";

const anchorBuild = () => vscode.commands.registerCommand(
  `${EXT_NAME}.build`,
  async () => {
    vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      title: "Building Anchor ⚓ Program ...",
      cancellable: false
    }, async (progress, token) => {
      await spawnChan('anchor', ['build'], 'build');
    });
  }
);

const anchorBuildVerifiable = () => vscode.commands.registerCommand(
  `${EXT_NAME}.buildVerifiable`,
  async () => {
    vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      title: "Building all programs, verifiable Anchor ⚓ CLI...",
      cancellable: false
    }, async (progress, token) => {
      const programsPath = path.join(WORKSPACE_PATH(), 'programs');
      const directories = getDirectories(programsPath);

      chan.show(true);

      for (const directory of directories) {
        const programDirectory = path.join(programsPath, directory);
        await spawnChan('anchor', ['build', '--verifiable'], `build verifiable ${directory}`, programDirectory);
      }
    });
  }
);

const anchorBuildVerifiableItem = (prg: ProgramItem) =>
  vscode.window.withProgress({
    location: vscode.ProgressLocation.Notification,
    title: `Building ${prg.label}, verifiable Anchor ⚓ CLI...`,
    cancellable: false
  }, async (progress, token) => {
    const programsPath = path.join(WORKSPACE_PATH(), 'programs');
    const programDirectory = path.join(programsPath, prg.label);

    chan.show(true);

    await spawnChan('anchor', ['build', '--verifiable'], `build verifiable ${prg.label}`, programDirectory); 
  });

const anchorRemoveDockerImage = () => vscode.commands.registerCommand(
  `${EXT_NAME}.removeDockerImage`,
  async () => {
    vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      title: "Removing Docker image Anchor ⚓ CLI...",
      cancellable: false
    }, async (progress, token) => {
      spawnChan('docker ', ['rm', '-f', 'anchor-program'], 'remove build Docker Image');
    });
  }
);

export {
  anchorBuild,
  anchorBuildVerifiable,
  anchorBuildVerifiableItem,
  anchorRemoveDockerImage,
};
