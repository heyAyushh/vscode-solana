import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { getFiles } from "../helpers/util";

export class TestsProvider implements vscode.TreeDataProvider<TestItem> {

  private _onDidChangeTreeData: vscode.EventEmitter<TestItem | undefined | void> = new vscode.EventEmitter<TestItem | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<TestItem | undefined | void> = this._onDidChangeTreeData.event;

  constructor(private workspaceRoot: string | undefined) {
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: TestItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: TestItem): Thenable<TestItem[]> {
    if (!this.workspaceRoot) {
      vscode.window.showInformationMessage('No tests in empty workspace');
      return Promise.resolve([]);
    }

    if (element) {
      return Promise.resolve([]);
    } else {
      const testsPath = path.join(this.workspaceRoot, 'tests');
      if (this.pathExists(testsPath)) {
        return Promise.resolve(this.getTestItems(testsPath));
      } else {
        // vscode.window.showInformationMessage('Workspace has no tests folder');
        return Promise.resolve([]);
      }
    }

  }

  /**
   * Given the path to tests folder, returns all file names which matches /.(spec|test).[jt]s/ .
   */
  private getTestItems(testsPath: string): TestItem[] {
    if (this.pathExists(testsPath)) {
      const tests = getFiles(testsPath, '.(spec|test)?.[jtr]s');

      const toTst = (tstName: string): TestItem => {
        return new TestItem(tstName, vscode.TreeItemCollapsibleState.None, {
          command: 'vscode-anchor-view-tests.editEntry',
          title: '',
          arguments: [tstName]
        });
      };

      return tests ?
        tests.map((tst: string) => toTst(tst))
        : [];;
    } else {
      return [];
    }
  }

  private pathExists(p: string): boolean {
    try {
      fs.accessSync(p);
    } catch (err) {
      return false;
    }

    return true;
  }
}

export class TestItem extends vscode.TreeItem {

  constructor(
    public readonly fileName: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly command?: vscode.Command
  ) {
    super(fileName.split('.')[0], collapsibleState);

    // this.tooltip = `${this.label}-${this.version}`;
    // this.description = this.version;
  }

  // iconPath = {
  //   light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
  //   dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
  // };

  contextValue = 'test';
}

export const registerTestView = () => {
  const rootPath = (vscode.workspace.workspaceFolders && (vscode.workspace.workspaceFolders.length > 0))
    ? vscode.workspace.workspaceFolders[0].uri.fsPath : undefined;

  if (rootPath) {
    const testsProvider = new TestsProvider(rootPath);
    vscode.window.registerTreeDataProvider('vscode-anchor-view-tests', testsProvider);
    vscode.commands.registerCommand('vscode-anchor-view-tests.refreshEntry', () => testsProvider.refresh());
    vscode.commands.registerCommand('vscode-anchor-view-tests.test', () => vscode.commands.executeCommand(`vscode-anchor.test`));
    vscode.commands.registerCommand(
      'vscode-anchor-view-tests.skipLocalValidator',
      () => vscode.commands.executeCommand(`vscode-anchor.testAgainstLocalValidator`)
    );
    // @ts-expect-error
    vscode.commands.registerCommand('vscode-anchor-view-tests.editEntry', (fileName: string) => vscode.commands.executeCommand('vscode.open', vscode.Uri.joinPath(vscode.workspace.workspaceFolders[0].uri, 'tests', fileName)));
    // vscode.commands.registerCommand('vscode-anchor-view-tests.editEntry', (node: TestItem) => vscode.commands.executeCommand('vscode.open', vscode.Uri.joinPath(vscode.workspace.workspaceFolders[0].uri, 'tests', node.fileName)));
  }
};