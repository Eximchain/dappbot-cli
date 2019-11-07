import path from 'path';
import fs from 'fs';
import { AuthData, newAuthData } from '@eximchain/dappbot-types/spec/user';

export const AUTH_FILENAME = 'dappbotAuthData.json';
export const AUTH_FILE_PATH = path.resolve(__dirname, `./${AUTH_FILENAME}`);

export function initAuthFile() {
  if (!fs.existsSync(AUTH_FILE_PATH)) {
    fs.writeFileSync(AUTH_FILE_PATH, JSON.stringify(newAuthData(), null, 2));
  }
}

export function saveAuthToFile(newData:AuthData) {
  fs.writeFileSync(AUTH_FILE_PATH, JSON.stringify(newData, null, 2));
}