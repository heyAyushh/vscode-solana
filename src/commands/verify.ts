import { spawnChan } from "../helpers/spawnExec";
import * as vscode from 'vscode';
import { EXT_NAME } from "../config";

const anchorVerify = () => vscode.commands.registerCommand(
  `${EXT_NAME}.verify`,
  async () => {
    const programId = await vscode.window.showInputBox({
      placeHolder: 'Enter program id: C14Gs3oyeXbASzwUpqSymCKpEyccfEuSe8VRar9vJQRE',
      validateInput: async (text) => {
        return text.length !== 44 ?
          'Program id must be 44 characters long'
          : null;
      }
    });
    if (programId) {
      spawnChan(`anchor`,['verify', programId], 'Verify');
    }
  }
);

export {
  anchorVerify
};
