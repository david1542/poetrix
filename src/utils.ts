import * as fs from "fs";
import * as vscode from "vscode";

import { EXTENSION_NAME } from "./constants";

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function checkForToml(folderPath: string): boolean {
  return fs.existsSync(`${folderPath}/pyproject.toml`);
}

export function formatMessage(message: string): string {
  return `${EXTENSION_NAME}: ${message}`;
}

export function runCommand(
  command: string,
  cwd: string,
  show: boolean = true
): vscode.Terminal {
  const terminal = vscode.window.createTerminal({
    name: EXTENSION_NAME,
    cwd,
  });
  terminal.sendText(command);
  if (show) {
    terminal.show();
  } else {
    terminal.hide();
  }
  return terminal;
}

export async function setDefaultPythonInterpreter(pythonPath: string) {
  await vscode.workspace
    .getConfiguration()
    .update(
      "python.defaultInterpreterPath",
      pythonPath,
      vscode.ConfigurationTarget.Workspace
    );
}
