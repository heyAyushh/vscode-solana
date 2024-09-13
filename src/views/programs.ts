import * as vscode from 'vscode';
import {
  TreeDataProvider,
  EventEmitter, Event, TreeItem,
  window, TreeItemCollapsibleState,
  commands, workspace, FileSystemWatcher,
  RelativePattern, Uri
} from 'vscode';
import { readFileSync, accessSync } from 'fs';
import { join } from 'path';
import { getDirectories } from "../helpers/util";
import { parse } from '@ltd/j-toml';
import { anchorBuildVerifiableItem } from "../commands/build";
import path = require('path');
import { copyHashToClipboard } from '../commands/verify';

export class ProgramsProvider implements TreeDataProvider<ProgramItem> {
  private _onDidChangeTreeData: EventEmitter<ProgramItem | undefined | void> = new EventEmitter<ProgramItem | undefined | void>();
  readonly onDidChangeTreeData: Event<ProgramItem | undefined | void> = this._onDidChangeTreeData.event;

  private fileWatcher: FileSystemWatcher | undefined;

  constructor(private workspaceRoot: string | undefined) {
    this.setupFileWatcher();
  }

  private setupFileWatcher() {
    if (this.workspaceRoot) {
      this.fileWatcher = workspace.createFileSystemWatcher(
        new RelativePattern(this.workspaceRoot, '**/Cargo.toml')
      );

      this.fileWatcher.onDidChange(() => this.refresh());
      this.fileWatcher.onDidCreate(() => this.refresh());
      this.fileWatcher.onDidDelete(() => this.refresh());
    }
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
        return Promise.resolve([]);
      }
    }
  }

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

      return programs.map(program => new ProgramItem(program, programsV[program]));
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

  public registerCommands() {
    commands.registerCommand('vscode-anchor-view-programs.refreshEntry', () => this.refresh());
    commands.registerCommand('vscode-anchor-view-programs.addEntry', () => commands.executeCommand('vscode-anchor.new'));
    commands.registerCommand('vscode-anchor-view-programs.build', () => commands.executeCommand('vscode-anchor.build'));
    commands.registerCommand('vscode-anchor-view-programs.editEntry', (prg: ProgramItem | string) => openProgramFile(prg));
    commands.registerCommand('vscode-anchor-view-programs.buildVerifiableItem', (prg: ProgramItem) => anchorBuildVerifiableItem(prg));
    commands.registerCommand('vscode-anchor-view-programs.copyHash', async (prg: string) => copyHashToClipboard(prg));
  }

  dispose() {
    if (this.fileWatcher) {
      this.fileWatcher.dispose();
    }
  }
}

export class ProgramItem extends TreeItem {
  constructor(
    public readonly label: string,
    private readonly version: string
  ) {
    super(label, TreeItemCollapsibleState.None);

    this.tooltip = `${this.label}-${this.version}`;
    this.description = this.version;

    this.command = {
      command: 'vscode-anchor-view-programs.editEntry',
      title: 'Open Program',
      arguments: [this]
    };

    this.contextValue = 'program';
  }
}

const openProgramFile = (item: string | ProgramItem) => {
  let programName: string;
  if (typeof item === 'string') {
    programName = item;
  } else if (item instanceof ProgramItem) {
    programName = item.label;
  } else {
    window.showErrorMessage('Invalid program item');
    return;
  }

  if (!workspace.workspaceFolders || workspace.workspaceFolders.length === 0) {
    window.showErrorMessage('No workspace folder is open');
    return;
  }

  const programPath = Uri.joinPath(workspace.workspaceFolders[0].uri, 'programs', programName, 'src', 'lib.rs');

  workspace.openTextDocument(programPath).then(
    document => {
      window.showTextDocument(document);
    },
    error => {
      console.error('Error opening file:', error);
      window.showErrorMessage(`Unable to open file: ${programPath.fsPath}. Error: ${error.message}`);
    }
  );
};
