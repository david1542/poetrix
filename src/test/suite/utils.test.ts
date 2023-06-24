import * as assert from "assert";
import Mocha from "mocha";
import sinon from "sinon";
import * as vscode from "vscode";
import { EXTENSION_NAME } from "../../constants";
import { formatMessage, runCommand, setDefaultPythonInterpreter } from "../../utils";

Mocha.describe("Utils test suite", () => {
  Mocha.afterEach(() => {
    sinon.restore();
  });
  
  Mocha.describe("runCommand tests", () => {
    let createTerminalSpy: sinon.SinonStub<any, vscode.Terminal>;
    Mocha.beforeEach(() => {
      createTerminalSpy = sinon.stub(vscode.window, "createTerminal");
    });

    Mocha.afterEach(() => {
      createTerminalSpy.restore();
    });

    Mocha.it("test run command with default params", () => {
      // Spy on the vscode.window.createTerminal function
      const command = "some command";
      const cwd = "some cwd";
      const terminalSpy = sinon.spy() as any;
      terminalSpy.sendText = sinon.spy();
      terminalSpy.show = sinon.spy();
      terminalSpy.hide = sinon.spy();

      createTerminalSpy.returns(terminalSpy);

      runCommand(command, cwd);

      const params = { name: EXTENSION_NAME, cwd};
      assert.ok(createTerminalSpy.calledOnceWith(params));
      assert.ok(terminalSpy.sendText.calledOnceWith(command));
      assert.ok(terminalSpy.show.calledOnce);
      assert.ok(!terminalSpy.hide.called);
    });

    Mocha.it("test run command with show = false", () => {
      const command = "some command";
      const cwd = "some cwd";
      const terminalSpy = sinon.spy() as any;
      terminalSpy.sendText = sinon.spy();
      terminalSpy.show = sinon.spy();
      terminalSpy.hide = sinon.spy();

      createTerminalSpy.returns(terminalSpy);

      runCommand(command, cwd, false);

      const params = { name: EXTENSION_NAME, cwd};
      assert.ok(createTerminalSpy.calledOnceWith(params));
      assert.ok(terminalSpy.sendText.calledOnceWith(command));
      assert.ok(!terminalSpy.show.called);
      assert.ok(terminalSpy.hide.calledOnce);
    });
  });

  Mocha.describe("formatMessage tests", () => {
    // Tests that passing a non-empty string as message parameter returns a string with the correct format
    Mocha.it("test non empty string", () => {
      const message = "hello world";
      const expected = "Poetrix: hello world";
      const result = formatMessage(message);
      assert.strictEqual(result, expected);
    });

    // Tests that passing an empty string as message parameter returns a string with the correct format
    Mocha.it("test empty_string", () => {
      const message = "";
      const expected = "Poetrix: ";
      const result = formatMessage(message);
      assert.strictEqual(result, expected);
    });

    // Tests that the returned string contains the correct extension name
    Mocha.it("test extension name", () => {
      const message = "hello world";
      const result = formatMessage(message);
      assert.ok(result.includes(EXTENSION_NAME));
    });

    // Tests that the returned string contains the correct message
    Mocha.it("test message", () => {
      const message = "hello world";
      const expected = "Poetrix: hello world";
      const result = formatMessage(message);
      assert.strictEqual(result, expected);
    });
  });

  Mocha.describe("setDefaultPythonInterpreter tests", () => {
    Mocha.it('test happy path valid python path', async () => {
      const configurationStub = {
        update: sinon.spy()
      };
      sinon.stub(vscode.workspace, 'getConfiguration').returns(configurationStub as any);
      const pythonPath = '/usr/bin/python3';

      await setDefaultPythonInterpreter(pythonPath);

      assert.ok(configurationStub.update.calledOnceWith('python.defaultInterpreterPath', pythonPath, vscode.ConfigurationTarget.Workspace));
    });
  });
});
