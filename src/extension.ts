// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as fs from "fs";
import * as vscode from "vscode";
import { TerminalFile } from "./config";
import { checkForToml, formatMessage } from "./utils";
import path = require("path");

async function setDefaultPythonInterpreter(pythonPath: string) {
  await vscode.workspace
    .getConfiguration()
    .update(
      "python.defaultInterpreterPath",
      pythonPath,
      vscode.ConfigurationTarget.Workspace
    );
}

function runCommand(command: string, cwd: string, show: boolean = true): vscode.Terminal {
  const terminal = vscode.window.createTerminal({
    name: "Poetrix",
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


export function activate(context: vscode.ExtensionContext) {
  // Get the extension's storage path
  const storagePath = context.storageUri;
  // if storagePath.fsPath doesn't exist, create it
  if (!fs.existsSync(storagePath!.fsPath)) {
    fs.mkdirSync(storagePath!.fsPath);
  }

  // Generate a unique file path for the output
  const outputFileName = "terminal.out";
  const outputPath = path.join(storagePath?.fsPath!, outputFileName);
  const terminalFile = new TerminalFile(outputPath);

  const updateDisposable = vscode.commands.registerCommand(
    "poetrix.updateDependencies",
    async (uri: vscode.Uri) => {
      if (!uri) {
        return;
      }
      if (!checkForToml(uri.fsPath)) {
        vscode.window.showErrorMessage(
          formatMessage("No pyproject.toml file found in the selected folder.")
        );
        return;
      }
	  vscode.window.showInformationMessage(formatMessage("Updating dependencies..."));
	  runCommand("poetry update", uri.fsPath);
    }
  );

  const installDisposable = vscode.commands.registerCommand(
    "poetrix.installDependencies",
    async (uri: vscode.Uri) => {
      if (!uri) {
        return;
      }
	  if (!checkForToml(uri.fsPath)) {
        vscode.window.showErrorMessage(
          formatMessage("No pyproject.toml file found in the selected folder.")
        );
        return;
      }
	  vscode.window.showInformationMessage(formatMessage("Installing dependencies..."));
      runCommand("poetry install", uri.fsPath);
    }
  );

  const activateDisposable = vscode.commands.registerCommand(
    "poetrix.activateEnvironment",
    async (uri: vscode.Uri) => {
      terminalFile.flush();

      if (!uri) {
        return;
      }
      if (!checkForToml(uri.fsPath)) {
        vscode.window.showErrorMessage(
          formatMessage("No pyproject.toml file found in the selected folder.")
        );
        return;
      }
	  vscode.window.showInformationMessage(formatMessage("Activating environment..."));

      // Check if the folderPath contains a pyproject.toml file
      // If it does, then activate the environment
	  runCommand(`poetry env info --path > "${terminalFile.filePath}"`, uri.fsPath, false);
	  
	  // Read the file and remove the newline character
      const envPath = (await terminalFile.readGracefully()).slice(0, -1);
	  if (!fs.existsSync(envPath)) {
		vscode.window.showErrorMessage(formatMessage("No virtual environment found. Make sure you have run 'poetry install' first."));
		return;
	  }

	  const envName = path.basename(envPath);
	  const pythonPath = `${envPath}/bin/python`;
      runCommand("poetry shell", uri.fsPath);

      await setDefaultPythonInterpreter(pythonPath);
      await vscode.commands.executeCommand("python.setInterpreter");


	  vscode.window.showInformationMessage(formatMessage(`Activated ${envName}.`));
    }
  );

  context.subscriptions.push(updateDisposable);
  context.subscriptions.push(installDisposable);
  context.subscriptions.push(activateDisposable);
}

// This method is called when your extension is deactivated
export function deactivate(context: vscode.ExtensionContext) {
  // Clean up the storage path
  const storagePath = context.storageUri;
  if (storagePath) {
    fs.rmdirSync(storagePath.fsPath);
  }
}
