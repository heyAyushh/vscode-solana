import * as vscode from 'vscode';
import { EXT_NAME } from "../constants";
import chan from "../helpers/outputChannel";

export const clearLogs = () => vscode.commands.registerCommand(
  `${EXT_NAME}.logsClear`,
  async () => chan.clear()
);

export const showLogs = () => vscode.commands.registerCommand(
  `${EXT_NAME}.logsShow`,
  async () => chan.show()
);