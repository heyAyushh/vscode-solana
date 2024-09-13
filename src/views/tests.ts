import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { getFiles } from "../helpers/util";

export class TestsProvider implements vscode.TreeDataProvider<TestItem> {

  private _onDidChangeTreeData: vscode.EventEmitter<TestItem | undefined | void> = new vscode.EventEmitter<TestItem | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<TestItem | undefined | void> = this._onDidChangeTreeData.event;

  private fileWatcher: vscode.FileSystemWatcher | undefined;

  constructor(private workspaceRoot: string | undefined) {
    this.setupFileWatcher();
  }

  private setupFileWatcher() {
    if (this.workspaceRoot) {
      this.fileWatcher = vscode.workspace.createFileSystemWatcher(
        new vscode.RelativePattern(this.workspaceRoot, 'tests/**/*.[jt]s')
      );

      this.fileWatcher.onDidChange(() => this.refresh());
      this.fileWatcher.onDidCreate(() => this.refresh());
      this.fileWatcher.onDidDelete(() => this.refresh());
    }
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

  dispose() {
    if (this.fileWatcher) {
      this.fileWatcher.dispose();
    }
  }

  public registerCommands() {
    vscode.commands.registerCommand('vscode-anchor-view-tests.refreshEntry', () => this.refresh());
    vscode.commands.registerCommand('vscode-anchor-view-tests.test', () => vscode.commands.executeCommand(`vscode-anchor.test`));
    vscode.commands.registerCommand(
      'vscode-anchor-view-tests.skipLocalValidator',
      () => vscode.commands.executeCommand(`vscode-anchor.testAgainstLocalValidator`)
    );
    vscode.commands.registerCommand('vscode-anchor-view-tests.editEntry', (fileName: string) => {
      if (typeof fileName === 'string' && vscode.workspace.workspaceFolders) {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.joinPath(vscode.workspace.workspaceFolders[0].uri, 'tests', fileName));
      } else {
        vscode.window.showErrorMessage('Invalid file name or no workspace folder');
      }
    });
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
