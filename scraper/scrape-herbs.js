#!/usr/bin/env node

import * as cheerio from 'cheerio'
import { fileExists, readFile, singleExecute, writeFile } from '../utils.js'

export default async function scrapeHerbPages() {
  const fails = []
  const buffer = readFile('./scraper/browse/browse.json').toString()
  const { herbs } = JSON.parse(buffer)

  for (const herb of herbs) {
    const name = herb.name.toLowerCase()
    const HTML_PATH = `./scraper/herbs/${name}.html`

    if (fileExists(HTML_PATH)) continue

    console.log('Scraping', name)

    try {
      const $ = await cheerio.fromURL(herb.url)
      const html = $.html()

      writeFile(HTML_PATH, html)
      console.info('Success scraping', name)
    } catch (err) {
      fails.push(name)
      console.error(err)
    }
  }

  if (fails.length) console.error('Errors:', fails)
}

singleExecute(scrapeHerbPages)
