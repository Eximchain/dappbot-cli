import path from 'path';
import fs from 'fs';
import { AuthData, newAuthData } from '@eximchain/dappbot-types/spec/user';

export const AUTH_DATA_PATH = path.resolve(__dirname, './dappbotAuthData.json');

export function loadAuthFromFile():AuthData {
  if (fs.existsSync(AUTH_DATA_PATH)) {
    return JSON.parse(fs.readFileSync(AUTH_DATA_PATH).toString());
  } else {
    const freshAuth = newAuthData();
    fs.writeFileSync(AUTH_DATA_PATH, JSON.stringify(freshAuth, null, 2));
    return freshAuth;
  }
}

export function saveAuthToFile(newData:AuthData) {
  fs.writeFileSync(AUTH_DATA_PATH, JSON.stringify(newData, null, 2));
}