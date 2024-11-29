#!/usr/bin/env node

import fs from 'node:fs'
import flexsearch from 'flexsearch'
import { getPath } from '../utils.js'

const HERBS_PATH = getPath('./scraper/herbs')

const index = new flexsearch.Document({
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

const herbs = fs.readdirSync(HERBS_PATH).filter(name => name.endsWith('.json'))

for (const herb of herbs) {
  console.log('processing', herb)

  const buffer = fs.readFileSync(`${HERBS_PATH}/${herb}`, { encoding: 'utf8' })
  const json = JSON.parse(buffer)

  await index.addAsync(json)
}

const dataset = {}

await index.export(function (key, data) {
  dataset[key] = data
})

fs.writeFileSync(
  getPath('./searcher/dataset.json'),
  JSON.stringify(dataset, null, 1)
)
