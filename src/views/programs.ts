import {
  TreeDataProvider,
  EventEmitter, Event, TreeItem,
  window, TreeItemCollapsibleState,
  Command, commands, workspace, Uri
} from 'vscode';
import { readFileSync, accessSync } from 'fs';
import { join } from 'path';
import { getDirectories } from "../helpers/util";
import { parse } from '@ltd/j-toml';
import { anchorBuildVerifiableItem } from "../commands/build";

export class ProgramsProvider implements TreeDataProvider<ProgramItem> {

  private _onDidChangeTreeData: EventEmitter<ProgramItem | undefined | void> = new EventEmitter<ProgramItem | undefined | void>();
  readonly onDidChangeTreeData: Event<ProgramItem | undefined | void> = this._onDidChangeTreeData.event;

  constructor(private workspaceRoot: string | undefined) {
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: ProgramItem): TreeItem {
    return element;
  }

  getChildren(element?: ProgramItem): Thenable<ProgramItem[]> {
    if (!this.workspaceRoot) {
      window.showInformationMessage('No programs in empty workspace');
      return Promise.resolve([]);
    }

    if (element) {
      return Promise.resolve([]);
    } else {
      const programsPath = join(this.workspaceRoot, 'programs');
      if (this.pathExists(programsPath)) {
        return Promise.resolve(this.getProgramItems(programsPath));
      } else {
        // window.showInformationMessage('Workspace has no programs folder');
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
        const cargoToml = parse(
          readFileSync(join(programsPath, program, 'Cargo.toml'), 'utf-8')
        ) as Record<string, Record<string, string>>;

        return {
          [program]: cargoToml.package.version as string,
        };
      }).reduce((acc, cur) => {
        return { ...acc, ...cur };
      });

      const toPrgm = (moduleName: string, version: string): ProgramItem => {
        return new ProgramItem(moduleName, version, TreeItemCollapsibleState.None, {
          command: 'solana-view-programs.editEntry',
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
      accessSync(p);
    } catch (err) {
      return false;
    }

    return true;
  }
}

export class ProgramItem extends TreeItem {

  constructor(
    public readonly label: string,
    private readonly version: string,
    public readonly collapsibleState: TreeItemCollapsibleState,
    public readonly command?: Command
  ) {
    super(label, collapsibleState);

    this.tooltip = `${this.label}-${this.version}`;
    this.description = this.version;
  }

  // iconPath = {
  //   light: join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
  //   dark: join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
  // };

  contextValue = 'program';
}

export const registerProgramView = () => {
  const rootPath = (workspace.workspaceFolders && (workspace.workspaceFolders.length > 0))
    ? workspace.workspaceFolders[0].uri.fsPath : undefined;

  const programsProvider = new ProgramsProvider(rootPath);

  window.registerTreeDataProvider('solana-view-programs', programsProvider);
  commands.registerCommand('solana-view-programs.refreshEntry', () => programsProvider.refresh());
  commands.registerCommand('solana-view-programs.addEntry', () => commands.executeCommand('solana.new'));
  commands.registerCommand('solana-view-programs.build', () => commands.executeCommand('solana.build'));
  commands.registerCommand('solana-view-programs.deploy', () => commands.executeCommand('solana.deploy'));
  commands.registerCommand('solana-view-programs.buildVerifiableItem', (prg: ProgramItem) => anchorBuildVerifiableItem(prg));
  // @ts-expect-error
  commands.registerCommand('solana-view-programs.editEntry', (prgName: string) => commands.executeCommand('vscode.open', Uri.joinPath(workspace.workspaceFolders[0].uri, 'programs', prgName, 'src', 'lib.rs')));
};