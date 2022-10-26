/* eslint-disable @typescript-eslint/naming-convention */
import { execSync } from "child_process";
import * as vscode from "vscode";
import { isLinux, isMac } from "../helpers/platform";

export const EXT_NAME = "solana";

export const WORKSPACE_PATH = () => {
  if (vscode?.workspace?.workspaceFolders) {
    return vscode?.workspace?.workspaceFolders[0].uri.fsPath;
  } else {
    throw new Error(
      "not in workspace! please open Anchor folder in vscode workspace first!"
    );
  }
};

export const CONFIG_FOLDER = `${WORKSPACE_PATH()}/.vscode`;
export const CONFIG_FILE = `${CONFIG_FOLDER}/solana.json`;

export const IDLS_FOLDER = `${WORKSPACE_PATH()}/idls`;

export const configuration = vscode.workspace.getConfiguration("solana");

export const home = execSync("echo $HOME");
export const solanaBinPath = configuration.get("solana.solanaBinPath");

export const getSolanaPath = () => {
  let path = configuration.get("solana.solanaBinPath");
  if (!path) {
    if (isLinux || isMac) {
      path = `${home.toString().replace("\n", "")}/.local/share/solana/install/active_release/bin`;
      configuration.update("solana.solanaBinPath", path, true);
    } else {
      path = `${home.toString().replace("\n", "")}\\.local\\share\\solana\\install\\active_release\\bin`;
      configuration.update("solana.solanaBinPath", path, true);
    }
  }

  return path;
};

export const GITHUB_URL = `https://github.com/heyayushh/vscode-solana`;
export const solanaVersion = "v1.9.13";
export const SOLPG_BUILD_URL = 'https://api.solpg.io/build';
export const SERVER_URL = 'https://api.solpg.io';
export const FRAMEWORK_LANGUAGES = Object.freeze([{
  name: 'Native (rust)',
  extension: 'rs'
}, {
  name: 'Anchor (rust)',
  extension: 'rs'
}, {
  name: 'Seahorse (python)',
  extension: 'py'
}]);
export const EXPLORER_URL = "https://explorer.solana.com";
export const SOLSCAN_URL = "https://solscan.io";

import { Commitment } from "@solana/web3.js";

enum NetworkName {
  LOCALHOST = "localhost",
  DEVNET = "devnet",
  DEVNET_GENESYSGO = "devnet-genesysgo",
  TESTNET = "testnet",
  MAINNET_BETA = "mainnet-beta",
  MAINNET_BETA_GENESYSGO = "mainnet-beta-genesysgo",
  MAINNET_BETA_SERUM = "mainnet-beta-serum",
}

export enum Endpoint {
  LOCALHOST = "http://localhost:8899",
  DEVNET = "https://api.devnet.solana.com",
  DEVNET_GENESYSGO = "https://devnet.genesysgo.net/",
  TESTNET = "https://api.testnet.solana.com",
  MAINNET_BETA = "https://api.mainnet-beta.solana.com",
  MAINNET_BETA_GENESYSGO = "https://ssc-dao.genesysgo.net",
  MAINNET_BETA_SERUM = "https://solana-api.projectserum.com",
}

interface Network {
  name: NetworkName;
  endpoint: Endpoint;
}

export const NETWORKS: Network[] = [
  {
    name: NetworkName.LOCALHOST,
    endpoint: Endpoint.LOCALHOST,
  },
  {
    name: NetworkName.DEVNET,
    endpoint: Endpoint.DEVNET,
  },
  {
    name: NetworkName.DEVNET_GENESYSGO,
    endpoint: Endpoint.DEVNET_GENESYSGO,
  },
  {
    name: NetworkName.TESTNET,
    endpoint: Endpoint.TESTNET,
  },
  {
    name: NetworkName.MAINNET_BETA,
    endpoint: Endpoint.MAINNET_BETA,
  },
  {
    name: NetworkName.MAINNET_BETA_GENESYSGO,
    endpoint: Endpoint.MAINNET_BETA_GENESYSGO,
  },
  {
    name: NetworkName.MAINNET_BETA_SERUM,
    endpoint: Endpoint.MAINNET_BETA_SERUM,
  },
];

export const CUSTOM_NETWORK_NAME = "custom";

export const COMMITMENT_LEVELS: Commitment[] = [
  "processed",
  "confirmed",
  "finalized",
];