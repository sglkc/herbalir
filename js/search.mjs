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
    storeFields: ['title', 'pdf', 'image', 'description'],
    idField: 'title',
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
    const { title, pdf, text: textFile, image } = file
    const res = await fetch(textFile)
    const text = await res.text()
    const description = text.substring(0, 300)

    engine.add({ title, description, pdf, image, text })
  }

  return engine
}
