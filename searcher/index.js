#!/usr/bin/env node

import flexsearch from 'flexsearch'
import { Stemmer, Tokenizer } from 'sastrawijs'
import { readFile } from '../utils.js'

const stemmer = new Stemmer()
const tokenizer = new Tokenizer()

const index = new flexsearch.Document({
  stemmer: stemmer.stem,
  tokenize: tokenizer.tokenize,
  document: {
    id: 'nama',
    index: [
      'deskripsi',
      'bagian[]:nama',
      'bagian[]:penjelasan',
      'bagian[]:manfaat',
      'bagian[]:kandungan',
    ],
  }
})

const file = readFile('./searcher/dataset.json')
const dataset = JSON.parse(file)

for (const [key, data] of Object.entries(dataset)) {
  await index.import(key, data)
}

const search = process.argv.slice(2).join(' ') || 'sakit perut'

console.log(index.search(search))
