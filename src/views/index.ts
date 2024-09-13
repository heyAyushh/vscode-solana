import * as vscode from 'vscode';
import { ProgramsProvider } from "./programs";
import { TestsProvider } from "./tests";

export const registerViews = (context: vscode.ExtensionContext): vscode.Disposable[] => {
  const rootPath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  const disposables: vscode.Disposable[] = [];

  if (rootPath) {
    const programsProvider = new ProgramsProvider(rootPath);
    const testsProvider = new TestsProvider(rootPath);

    disposables.push(
      vscode.window.registerTreeDataProvider('vscode-anchor-view-programs', programsProvider),
      vscode.window.registerTreeDataProvider('vscode-anchor-view-tests', testsProvider)
    );

    programsProvider.registerCommands();
    testsProvider.registerCommands();
  }

  return disposables;
};
