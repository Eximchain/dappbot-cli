import { render } from 'ink';
import fs from 'fs';
import path from 'path';

export const fastRender:typeof render = (tree) => {
  // @ts-ignore Types don't know about fastmode
  return render(tree, { experimental: true })
}


export function cleanExit(message:string) {
  console.log(`\n${message}\n`)
  process.exit(1);
}

/**
 * Accepts one or more file names (string or string array)
 * and a directory, checks whether those files exist in said
 * directory.  File names do not need relative path prefixes.
 * If multiple names are provided, function returns true if
 * **any** of the files are present.
 * 
 * @param fileName 
 * @param dir 
 */
export function pathExists(fileName:string|string[], dir:string):boolean {
  const exists = (name:string) => fs.existsSync(path.resolve(dir, name))
  if (Array.isArray(fileName)) {
    return fileName.some(file => exists(file))
  } else {
    return exists(fileName);
  }
}

