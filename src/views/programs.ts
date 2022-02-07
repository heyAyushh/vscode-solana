import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { getDirectories } from "../helpers/util";
import toml from '@ltd/j-toml';
import { anchorBuildVerifiableItem } from "../commands/build";

export class ProgramsProvider implements vscode.TreeDataProvider<ProgramItem> {

  private _onDidChangeTreeData: vscode.EventEmitter<ProgramItem | undefined | void> = new vscode.EventEmitter<ProgramItem | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<ProgramItem | undefined | void> = this._onDidChangeTreeData.event;

  constructor(private workspaceRoot: string | undefined) {
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: ProgramItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: ProgramItem): Thenable<ProgramItem[]> {
    if (!this.workspaceRoot) {
      vscode.window.showInformationMessage('No programs in empty workspace');
      return Promise.resolve([]);
    }

    if (element) {
      return Promise.resolve([]);
    } else {
      const programsPath = path.join(this.workspaceRoot, 'programs');
      if (this.pathExists(programsPath)) {
        return Promise.resolve(this.getProgramItems(programsPath));
      } else {
        // vscode.window.showInformationMessage('Workspace has no programs folder');
        return Promise.resolve([]);
      }
    }

  }

  /**
   * Given the path to programs folder, return all directories with Carto.toml version.
   */
  private getProgramItems(programsPath: string): ProgramItem[] {
    if (this.pathExists(programsPath)) {
      const programs = getDirectories(programsPath);
      const programsV = programs.map(program => {
        const cargoToml = toml.parse(
          fs.readFileSync(path.join(programsPath, program, 'Cargo.toml'), 'utf-8')
        ) as Record<string, Record<string, string>>;

        return {
          [program]: cargoToml.package.version as string,
        };
      }).reduce((acc, cur) => {
        return { ...acc, ...cur };
      });

      const toPrgm = (moduleName: string, version: string): ProgramItem => {
        return new ProgramItem(moduleName, version, vscode.TreeItemCollapsibleState.None, {
          command: '',
          title: '',
          arguments: [moduleName]
        });
      };

      const prgms = programs ?
        programs.map(prgm => toPrgm(prgm, programsV[prgm]))
        : [];
      return prgms;
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

export class ProgramItem extends vscode.TreeItem {

  constructor(
    public readonly label: string,
    private readonly version: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly command?: vscode.Command
  ) {
    super(label, collapsibleState);

    this.tooltip = `${this.label}-${this.version}`;
    this.description = this.version;
  }

  // iconPath = {
  //   light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
  //   dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
  // };

  contextValue = 'program';
}

export const registerProgramView = () => {
  const rootPath = (vscode.workspace.workspaceFolders && (vscode.workspace.workspaceFolders.length > 0))
    ? vscode.workspace.workspaceFolders[0].uri.fsPath : undefined;

  const programsProvider = new ProgramsProvider(rootPath);

  vscode.window.registerTreeDataProvider('vscode-anchor-view-programs', programsProvider);
  vscode.commands.registerCommand('vscode-anchor-view-programs.refreshEntry', () => programsProvider.refresh());
  vscode.commands.registerCommand('vscode-anchor-view-programs.addEntry', () => vscode.commands.executeCommand('vscode-anchor.new'));
  vscode.commands.registerCommand('vscode-anchor-view-programs.build', () => vscode.commands.executeCommand('vscode-anchor.build'));
  vscode.commands.registerCommand('vscode-anchor-view-programs.buildVerifiableItem', (prg: ProgramItem) => anchorBuildVerifiableItem(prg));
  // @ts-expect-error
  vscode.commands.registerCommand('vscode-anchor-view-programs.editEntry', (prg: ProgramItem) => vscode.commands.executeCommand('vscode.open', vscode.Uri.joinPath(vscode.workspace.workspaceFolders[0].uri, 'programs', prg.label, 'src', 'lib.rs')));
};