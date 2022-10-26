import { spawnChan } from "../helpers/spawnExec";
import * as vscode from 'vscode';
import { EXT_NAME, WORKSPACE_PATH } from "../constants";
import chan, { appendChan } from "../helpers/outputChannel";
import path = require("path");
import { getDirectories } from "../helpers/util";
import * as os from 'os';

const installSoteriaCli = async () => {
  const isSoteriaCliSupported = () => os.arch() === 'x64' && os.type() === 'Linux';
  if (isSoteriaCliSupported()) {
    try {
      await spawnChan('sh', ['-c', '"$(curl -k https://supercompiler.xyz/install)"'], 'soteria install', WORKSPACE_PATH());
      await spawnChan('export', ['PATH=$PWD/soteria-linux-develop/bin/:$PATH'], 'soteria install', WORKSPACE_PATH(), true);
    } catch (err) {
      if (err instanceof Error) {
        appendChan('ERROR', err.message);
        chan.show(true);
      }
      vscode.window.showErrorMessage('Installing soteria failed ;c ');
    }
  } else {
    // Install using docker
    try {
      await spawnChan('docker', ['run', '-v', WORKSPACE_PATH(), '-it', 'greencorelab/soteria:0.1.0', '/bin/bash'], 'build anchor cli from source');
    } catch (err) {
      if (err instanceof Error) {

      }
    }
  }
};

const anchorAnalyze = () => vscode.commands.registerCommand(
  `${EXT_NAME}.analyze`,
  async () => {
    vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      title: "Analyzing Anchor ⚓ Project ...",
      cancellable: false
    }, async (progress, token) => {
      if (!vscode.workspace.workspaceFolders) {
        vscode.window.showErrorMessage(
          "No workspace folder is open. Please open a workspace folder."
        );
        return;
      }

      const isSoteriaCliSupported = () => os.arch() === 'x64' && os.type() === 'Linux';

      const programsPath = path.join(WORKSPACE_PATH(), 'programs');
      const directories = getDirectories(programsPath);

      chan.show(true);

      chan.appendLine('*****************************************');
      chan.appendLine('*****************************************');
      chan.appendLine('Analyze: Cargo Audit has been started!');
      chan.appendLine('*****************************************');
      chan.appendLine('*****************************************');

      try {
        await spawnChan('cargo', ['audit'], 'Cargo Audit', WORKSPACE_PATH(), true);
      } catch(err) {
        await spawnChan('cargo', ['install', 'audit'], 'Cargo Audit Install', WORKSPACE_PATH(), true);
        await spawnChan('cargo', ['audit'], 'Cargo Audit', WORKSPACE_PATH(), true);
      }

      chan.appendLine('*****************************************');
      chan.appendLine('*****************************************');
      chan.appendLine('Analyze: Cargo Clippy has been started!');
      chan.appendLine('*****************************************');
      chan.appendLine('*****************************************');

      for (const directory of directories) {
        const programDirectory = path.join(programsPath, directory);
        await spawnChan('cargo', ['clippy'], `cargo clippy ${directory}`, programDirectory, true);
      }

      if (isSoteriaCliSupported()) {
        try {
          await spawnChan('soteria', ['-v'], '', '', true);

          chan.clear();
          chan.show(true);
          chan.appendLine('*****************************************');
          chan.appendLine('*****************************************');
          chan.appendLine('Analyze: Soteria has been started!');
          chan.appendLine('*****************************************');
          chan.appendLine('*****************************************');

          for (const directory of directories) {
            const programDirectory = path.join(programsPath, directory);
            await spawnChan('soteria', ['.'], `soteria analyze ${directory}`, programDirectory, true);
          }

          vscode.window.showInformationMessage(`Anchor ⚓: Analyzing and Scan code has been completed!`);
        } catch (err) {
          if (!(err instanceof Error)) {
            throw new Error('Unexpected error');
          }

          if (err.message === 'spawn soteria ENOENT') {
            const selection = await vscode
              .window
              .showWarningMessage(
                "Soteria CLI was not found!",
                "Install it",
                "Ignuwu"
              );

            if (selection === "Install it") {
              await installSoteriaCli();
              vscode.commands.executeCommand(`${EXT_NAME}.analyze`);
            } else {
              chan.appendLine("Soteria CLI was not found and not Installed! ngmi");
            };
          }
        }
      } else {
        const terminal = vscode.window.createTerminal(`Soteria Analyze`);
        terminal.sendText('docker run -v ' + WORKSPACE_PATH() + '/programs:/workspace -it greencorelab/soteria:0.1.0 /bin/bash');

        terminal.show();
        vscode.window.showInformationMessage(`run 'soteria -analyzeAll .' inside every program directory.`);

        vscode.window.onDidCloseTerminal(async (terminal) => {
          if (terminal.name === 'Soteria Analyze') {
            await spawnChan(`docker ps -a | grep "soteria" | awk '{print $1}' | xargs docker rm -f`, [], '', '', true);
            chan.clear();
          }
        });
      }

      vscode.window.showInformationMessage('Analyzing and Scan code has been completed!');
    });
  }
);

export {
  anchorAnalyze
};
