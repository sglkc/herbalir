import { resolve } from 'node:url'
import * as cheerio from 'cheerio'
import { fileExists, readFile, singleExecute, writeFile } from './utils.js'

const HTML_PATH = './html/browse.html'

export async function scrapeBrowsePage() {
  /*** @type {cheerio.CheerioAPI} */
  let $

  if (fileExists(HTML_PATH)) {
    const file = readFile(HTML_PATH)
    $ = cheerio.loadBuffer(file)
  } else {
    $ = await cheerio.fromURL('https://herbapedia.id/Browse')
    const html = $.html()

    writeFile(HTML_PATH, html)
  }

  const herbs = []

  $('h6 > a').each(function () {
    const url = resolve('https://herbapedia.id', $(this).prop('href'))
    const name = $('strong', this).text()
    const scientific = $('em', this).text()
    const nicknames = $('[style*=none]', this).toArray()
      .map((e) => $(e).text().split(','))
      .flat()
      .filter(Boolean)
      .map((name) => name.trim())

    herbs.push({ name, scientific, nicknames, url })
  })

  writeFile('./json/browse.json', JSON.stringify({ herbs }, null, 1))
}

singleExecute(scrapeBrowsePage)
