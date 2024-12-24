import Minisearch from './minisearch/index.js'
import { Stemmer, Tokenizer } from './sastrawijs/sastrawijs.esm.mjs'
import stopWords from './stop-words.mjs'

const tokenizer = new Tokenizer()
const stemmer = new Stemmer()
const tokenize = (/** @type {string} */ str) => tokenizer.tokenize(str)
const stem = (/** @type {string} */ str) => stemmer.stem(str.toLowerCase())
const processTerm = (/** @type {string} */ str) => stopWords.has(str) ? null : stem(str)

export default async function createSearch() {
  const engine = new Minisearch({
    fields: ['text'],
    storeFields: ['pdf', 'image'],
    idField: 'pdf',
    processTerm,
    tokenize,
    searchOptions: {
      combineWith: 'and',
      fuzzy: 0.2,
      maxFuzzy: 3,
      processTerm,
      tokenize,
    }
  })

  const res = await fetch('data.json')
  const { files } = await res.json()

  for (const file of files) {
    const { pdf, text: textFile, image } = file
    const res = await fetch(textFile)
    const text = await res.text()

    engine.add({ pdf, image, text })
  }

  return engine
}
