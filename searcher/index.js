import fs from 'node:fs'
import flexsearch from 'flexsearch'

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

const file = fs.readFileSync('./dataset.json')
const dataset = JSON.parse(file)

for (const [key, data] of Object.entries(dataset)) {
  await index.import(key, data)
}

const search = process.argv.slice(2).join(' ') || 'sakit perut'

console.log(index.search(search, { suggest: true }))
