import fs from 'node:fs'
import path from 'node:path'

/**
 * @param {string[]} dirs
 */
export function getPath(...dirs) {
  return path.resolve(import.meta.dirname, ...dirs)
}

/**
 * @param {string} dir
 */
export function readFile(dir) {
  return fs.readFileSync(getPath(dir))
}

/**
 * @param {string} dir
 * @param {string} content
 */
export function writeFile(dir, content) {
  return fs.writeFileSync(getPath(dir), content)
}

/**
 * @param {string} dir
 */
export function fileExists(dir) {
  return fs.existsSync(getPath(dir))
}
