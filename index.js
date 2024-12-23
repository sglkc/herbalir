import fs from 'node:fs'
import Minisearch from 'minisearch'
import { Stemmer, Tokenizer } from 'sastrawijs'
import { getPath, readFile } from './utils.js'
import { stopWords } from './stop-words.js'

const TEXT_PATH = (...str) => getPath('./text', ...str)

const tokenizer = new Tokenizer()
const stemmer = new Stemmer()
const tokenize = (/** @type {string} */ str) => tokenizer.tokenize(str)
const stem = (/** @type {string} */ str) => stemmer.stem(str.toLowerCase())
const processTerm = (/** @type {string} */ str) => stopWords.has(str) ? null : stem(str)

const documentsTxt = fs.readdirSync(TEXT_PATH())
  .filter(n => n.endsWith('.txt'))

const documents = documentsTxt.map((file) => ({
  title: file,
  text: readFile(TEXT_PATH(file)).toString()
}))

const engine = new Minisearch({
  fields: ['title', 'text'],
  idField: 'title',
  logger: console.log,
  processTerm,
  tokenize,
  searchOptions: {
    combineWith: 'or',
    fuzzy: 0.2,
    maxFuzzy: 3,
    processTerm,
    tokenize,
  }
})

engine.addAll(documents)

const results = engine.search('test')

console.log(results)
