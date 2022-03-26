import * as vscode from 'vscode';
import chan, { appendChan } from "./outputChannel";
import { isMac } from "./platform";
import { spawnChan } from "./spawnExec";

export const avmList = async () => spawnChan('avm', ['list'], 'avm list', '', true);
export const checkAvm = async () => spawnChan('avm', ['--version'], 'avm version', '', true);
export const installAvm = async () => vscode.window.withProgress({
  location: vscode.ProgressLocation.Notification,
  title: `Installing Anchor Version Manager ⚓ ...`,
  cancellable: false
}, async (progress, token) => {
  try {
    const isInstalled = await spawnChan(`cargo`,
      ['install', '--git', 'https://github.com/project-serum/anchor', 'avm', '--locked', '--force'],
      'Install Anchor cli', '', true
    );
    return Promise.resolve(isInstalled);
  } catch (err) {
    if (err instanceof Error) {
      chan.appendLine(err.message);
      chan.show(true);
    }
    return Promise.reject(err);
  }
});

export const avmUse = async (version: string) => spawnChan('avm', ['use', version], 'avm list', '', true);

export const installAnchorUsingAvm = async () => {
  try {
    const listBuffer = (await avmList())?.stdout;
    const list = listBuffer?.toString().split('\n').reverse().filter(Boolean);
    if (!list || !list.length) {
      appendChan('ERROR', `avm list ERROR`);
      chan.show(true);
      return;
    }

    const quickPick = await vscode.window.showQuickPick(list, {
      placeHolder: 'Select a version of Anchor to use',
    });
    if (!quickPick) {
      return;
    }
    const version = quickPick.split('\t')[0];

    vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      title: `Installing Anchor ⚓ CLI ${version}...`,
      cancellable: false
    }, async (progress, token) => {
      if(!isMac){
        await spawnChan('sudo', ['apt-get', 'install', '-y', 'libudev-dev'], `Install anchor dependencies`);
      }
      const isInstalled = await spawnChan('avm', ['install', version], `Installing Anchor CLI ${version} using avm`);
      await avmUse(version);
      return Promise.resolve(isInstalled);
    });
  } catch (err) {
    if (err instanceof Error) {
      chan.appendLine(err.message);
      chan.show(true);
    }
    return Promise.reject(err);
  }
};
