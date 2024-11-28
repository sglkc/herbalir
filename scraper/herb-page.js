import * as cheerio from 'cheerio'
import { readFile, singleExecute } from './utils.js'

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
  const sections = [
    { title: 'summary', contents: [] }
  ]

  $('.p-blog').children().each(function () {
    const text = $(this).text()

    switch (this.tagName.toLowerCase()) {
      case 'p':
        sections[index].contents.push(text)
        break
      case 'h3':
      case 'h2':
        index++
        sections[index] = { title: text, contents: [] }
        break
      case 'ul':
        $('li', this).each(function () {
          const title = $('> strong', this).text()
          const content = text.slice(title.length + 2)
          const list = { title, content }

          sections[index].contents.push(list)
        })
        break
    }
  })
}

singleExecute(() => processHerbPage(readFile('./html/herbs/jahe.html')))
