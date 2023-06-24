import * as fs from "fs";

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function checkForToml(folderPath: string): boolean {
  return fs.existsSync(`${folderPath}/pyproject.toml`);
}
