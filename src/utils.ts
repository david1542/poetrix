import * as fs from "fs";
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