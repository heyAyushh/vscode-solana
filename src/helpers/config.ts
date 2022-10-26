/* eslint-disable @typescript-eslint/naming-convention */
import {
  workspace,
} from 'vscode';
import { promises as fs } from "fs";
import { CONFIG_FILE, CONFIG_FOLDER, IDLS_FOLDER } from "../constants";
import { appendChan } from "./outputChannel";

export const solPgMode = (): Boolean => {
  // @ts-expect-error
  const config = workspace.getConfiguration('solana', workspace?.workspaceFolders[0]?.uri);
  const solPgMode = config.get('solPgMode');

  // @ts-expect-error
  return solPgMode;
};

export const getWorkspaceSolanaConfig = async () => {
  try {
    await fs.readFile(CONFIG_FILE, 'utf-8');
  } catch (e) {
    try {
      await fs.access(CONFIG_FOLDER);
    } catch {
      fs.mkdir(CONFIG_FOLDER);
    }
    try {
      const data = {
        'solpg-uuid': 'null',
        'language': 'null',
      };
      await fs.writeFile(CONFIG_FILE, JSON.stringify(data, null, 4), "utf-8");
    } catch (e) {
      appendChan('INFO', 'Config File/Folder doesn\'t exist or have access!');
      return null;
    }
  }

  const data = await fs.readFile(CONFIG_FILE, 'utf-8');
  return JSON.parse(data);
};

export const getIDLsFolder = async () => {
  try {
    await fs.access(IDLS_FOLDER);
  } catch (e) {
    fs.mkdir(IDLS_FOLDER);
  }

  return IDLS_FOLDER;
};

export const updateWorkspaceSolanaConfig = (solanaConfig: SolanaConfig) => fs.writeFile(CONFIG_FILE, JSON.stringify(solanaConfig, null, 4), "utf-8");
type SolanaConfig = {
  'solpg-uuid': string,
  'language': 'Anchor (rust)' | 'Native (rust)' | 'Seahorse (python)'
};

export const wallet = () => workspace.getConfiguration('solana').wallet;
