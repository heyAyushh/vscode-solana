// parse command to default binary paths in all environments

import { execSync } from "child_process";
import { getSolanaPath, home } from "../config";

export const isMac = process.platform === "darwin";
export const isLinux = process.platform === "linux";
export const isWin = process.platform === "win32";

export const parseCommand = (cmd: string): string  => {
  if (isLinux) {
    switch(cmd){
      // case 'anchor':
      //   return `${home.toString().replace('\n', '')}/.cargo/bin/anchor`;
      case 'solana':
        return `${home.toString().replace('\n', '')}/.local/share/solana/install/active_release/bin/solana`;
    }
  }

  return cmd;
};


