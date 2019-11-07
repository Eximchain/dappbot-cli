import path from 'path';
import fs from 'fs';
import { AuthData, newAuthData } from '@eximchain/dappbot-types/spec/user';

export const AUTH_DATA_PATH = path.resolve(__dirname, './dappbotAuthData.json');

export function initAuthFile() {
  if (!fs.existsSync(AUTH_DATA_PATH)) {
    fs.writeFileSync(AUTH_DATA_PATH, JSON.stringify(newAuthData(), null, 2));
  }
}

export function saveAuthToFile(newData:AuthData) {
  fs.writeFileSync(AUTH_DATA_PATH, JSON.stringify(newData, null, 2));
}