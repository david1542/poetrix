import * as assert from "assert";
import fs from "fs";
import Mocha from "mocha";
import sinon from "sinon";
import { TerminalFile } from "../../config";

Mocha.describe("Config test suite", () => {
    Mocha.afterEach(() => {
    sinon.restore();
  });
  
  Mocha.it("test create config file when it does not exist", () => {
    const existsSyncStub = sinon.stub(fs, "existsSync").returns(false);
    const writeFileSync = sinon.stub(fs, "writeFileSync");

    const filePath = "./test.txt";
    const terminalFile = new TerminalFile(filePath);

    assert.strictEqual(terminalFile.filePath, filePath);
    assert.ok(existsSyncStub.calledOnceWith(filePath));
    assert.ok(writeFileSync.calledOnceWith(filePath, ""));
  });

  Mocha.it("test do not create a config file when exists", () => {
    const existsSyncStub = sinon.stub(fs, "existsSync").returns(true);
    const writeFileSync = sinon.stub(fs, "writeFileSync");

    const filePath = "./test.txt";
    const terminalFile = new TerminalFile(filePath);

    assert.strictEqual(terminalFile.filePath, filePath);
    assert.ok(existsSyncStub.calledOnceWith(filePath));
    assert.ok(writeFileSync.notCalled);
  });
});
