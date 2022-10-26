import { spawnChan } from "../helpers/spawnExec";
import * as vscode from 'vscode';
import { CONFIG_FILE, EXT_NAME, SOLPG_BUILD_URL, WORKSPACE_PATH } from "../constants";
import { getDirectories } from "../helpers/util";
import chan, { appendChan } from "../helpers/outputChannel";
import { ProgramItem } from "../views/programs";
import { getIDLsFolder, getWorkspaceSolanaConfig, solPgMode } from "../helpers/config";
import { promises as fs } from "fs";
import { globby } from 'globby';
import path = require("path");
import got from "got";
import { checkSolPgLanguageConfig } from "../helpers/solpg";

const anchorBuild = () => vscode.commands.registerCommand(
  `${EXT_NAME}.build`,
  async () => {
    vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      title: "Building Solana Program ...",
      cancellable: false
    }, async (progress, token) => {
      if (solPgMode()) {
        // check if .vscode/solana.json is there
        let solanaConfig = await getWorkspaceSolanaConfig();
        const uuid = solanaConfig['solpg-uuid'];
        const programs = await fs.readdir(`${WORKSPACE_PATH()}/programs`);
        let quickPick: string | undefined;

        if (programs.length > 1) {
          quickPick = await vscode.window.showQuickPick(programs, {
            placeHolder: 'Select a program to build',
          });
          if (!quickPick) {
            return;
          }
        } else if (programs.length === 1) {
          quickPick = programs[0];
        } else {
          vscode.window.showInformationMessage(`Solana: Found no files under programs folder to build!`);
          return;
        }

        const language = await checkSolPgLanguageConfig();
        if(!language){
          return null;
        }

        const fullFilesPath: String[] = await globby(`${WORKSPACE_PATH()}/programs/${quickPick}/src/**/**.${language.extension}`);
        const files = await Promise.all(fullFilesPath.map(async (f) => {
          // @ts-expect-error f
          const content: string = await fs.readFile(f, 'utf-8');
          return [f.split(`/programs/${quickPick}`)[1], content];
        }));

        try {
          const data: Record<string, string> = await got.post(SOLPG_BUILD_URL, {
            json: {
              files,
              uuid: uuid ? uuid : undefined
            },
          }).json();

          if (!uuid) {
            solanaConfig['solpg-uuid'] = data.uuid;
            await fs.writeFile(CONFIG_FILE, JSON.stringify(solanaConfig, null, 4), "utf-8");
          }

          if (data.idl) {
            const folder = await getIDLsFolder();
            await fs.writeFile(`${folder}/${quickPick}.json`, JSON.stringify(data.idl, null, 4), "utf-8");
          }

          appendChan('INFO', data.stderr);
          vscode.window.showInformationMessage(`Build Successful! Finished ${data.stderr.split('\n    Finished')[1]}`);
        } catch (err) {
          appendChan('ERROR', 'Building using SolPg Failed!');
          // @ts-expect-error
          appendChan('ERROR', err);
        }
      } else {
        await spawnChan('anchor', ['build'], 'build');
      }
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
