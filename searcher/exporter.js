import fs from 'node:fs'
import path from 'node:path'
import flexsearch from 'flexsearch'

const HERBS_PATH = path.resolve(import.meta.dirname, '../scraper/json/herbs')

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

const herbs = fs.readdirSync(HERBS_PATH)

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

fs.writeFileSync('./dataset.json', JSON.stringify(dataset, null, 1))
