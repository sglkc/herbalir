import * as cheerio from 'cheerio'
import { readFile, writeFile, singleExecute } from './utils.js'

export async function processHerbPage(herb) {
  const { name, scientific, nicknames } = herb
  const html = readFile(`./scraper/herbs/${name.toLowerCase()}.html`)
  const $ = cheerio.loadBuffer(html)
  const deskripsi = []
  const sections = []
  let index = -1

  $('.p-blog').children().each(function () {
    const text = $(this).text().trim()

    switch (this.tagName.toLowerCase()) {
      case 'h2':
        index++
        sections[index] = {
          nama: text,
          penjelasan: '',
          kandungan: '',
          manfaat: '',
        }
        break
      case 'p':
        if (index === -1) {
          deskripsi.push(text)
          return
        }

        if (!sections[index]) return

        sections[index].penjelasan = $(this).text()
        break
      case 'ol':
      case 'ul':
        $('> li', this).each(function (i) {
          const items = []

          if ($('li', this).length) {
            $('li', this).each(function () {
              const text = $(this).text().replace(/^:|:$/g, '').trim()
              items.push(text)
            })
          } else {
            const text = $(this).text().replace(/^:|:$/g, '').trim()
            items.push(text)
          }

          const text = items.join('\n')

          if (i) {
            sections[index].manfaat = text
          } else {
            sections[index].kandungan = text.replace('Kandungan: ', '')
          }
        })

        break
    }
  })

  const data = {
    nama: `${name} (${scientific})`,
    sebutan: nicknames,
    deskripsi: deskripsi.join('\n'),
    bagian: sections
  }

  writeFile(
    `./scraper/herbs/${name.toLowerCase()}.json`,
    JSON.stringify(data, null, 1)
  )

  console.log(`${name} - preprocessing finished`)
}

singleExecute(() => {
  const buffer = readFile('./scraper/browse/browse.json').toString()
  const { herbs } = JSON.parse(buffer)

  herbs.forEach(processHerbPage)
})
