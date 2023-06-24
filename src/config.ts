import * as fs from "fs";
import { sleep } from "./utils";

export class TerminalFile {
    public filePath: string;

    constructor(filePath: string) {
        this.filePath = filePath;
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, "");
        }
    }

    public create(): void {
        if (!fs.existsSync(this.filePath)) {
            fs.writeFileSync(this.filePath, "");
        }
    }
    public read(): string {
        return fs.readFileSync(this.filePath, "utf8");
    }

    public async readGracefully(interval: number = 500, maxRetries: number = 6): Promise<string> {
        // Wait for the file to contain data, with limit of maxRetries * interval seconds
        let counter = 0;
        while (!this.read() && counter < maxRetries) {
          await sleep(interval);
          counter++;
        }
        return this.read();
    }

    public flush(): void {
        fs.writeFileSync(this.filePath, "");
    }

    public dispose(): void {
        fs.unlinkSync(this.filePath);
    }
}