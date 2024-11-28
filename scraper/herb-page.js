import * as cheerio from 'cheerio'
import { readFile, writeFile, singleExecute } from './utils.js'

/**
 * @param {string | Buffer} html
 */
export async function processHerbPage(html) {
  /** @type {cheerio.CheerioAPI} */
  let $

  if (typeof html === 'string') {
    $ = cheerio.load(html)
  } else {
    $ = cheerio.loadBuffer(html)
  }

  let index = 0
  const name = $('.p-blog > p > strong').contents().first().text().toLowerCase()
  const sections = [
    { title: 'summary', contents: [] }
  ]

  $('.p-blog').children().each(function () {
    const text = $(this).text().trim()

    switch (this.tagName.toLowerCase()) {
      case 'p':
        sections[index].contents.push(text)
        break
      case 'h4':
      case 'h3':
      case 'h2':
        index++
        sections[index] = { title: text, contents: [] }
        break
      case 'ol':
      case 'ul':
        if (!$('ol, ul', this).length) {
          $('li', this).each(function () {
            const text = $(this).text()
            sections[index].contents.push(text)
          })

          return
        }

        $('> li', this).each(function () {
          index++
          const title = $('h4', this).text().trim().replace(':', '')

          if (!$('li', this).length) {
            const text = $(this).text().replace(/^:|:$/g, '').trim()
            const [title, contents] = text.split(': ')

            sections[index] = { title, contents }
            return
          }

          const items = []

          $('li', this).each(function () {
            const text = $(this).text().replace(/^:|:$/g, '').trim()
            const [title, contents] = text.split(': ')

            items.push({ title, contents })
          })

          sections[index] = { title, contents: items }
        })

        break
    }
  })

  writeFile(
    `./json/herbs/${name}.json`,
    JSON.stringify({ sections }, null, 1)
  )

  console.log(`${name} - preprocessing finished`)
}

singleExecute(() => {
  const buffer = readFile('./json/browse.json').toString()
  const { herbs } = JSON.parse(buffer)

  for (const { name } of herbs) {
    processHerbPage(
      readFile(`./html/herbs/${name.toLowerCase()}.html`)
    )
  }
})
