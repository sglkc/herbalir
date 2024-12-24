import createSearch from './search.mjs'

const container = document.querySelector('.book-list')
/** @type {HTMLTemplateElement} */
const template = document.querySelector('#book-item-template').cloneNode(true)

const form = document.querySelector('form')

/**
 * @param {Object} metadata
 * @param {string} metadata.title
 * @param {string} metadata.image
 * @param {string} metadata.pdf
 * @param {string|number} metadata.score
 * @param {string[]} metadata.matches
 */
function renderItem({ title, image, pdf, score, matches }) {
  /** @type {HTMLDivElement} */
  const element = template.cloneNode(true)
  /** @type {HTMLElement['querySelector']} */
  const $ = element.querySelector.bind(element)

  element.id = ''
  $('img').src = image
  $('.book-score').textContent = score
  $('.book-title').textContent = title
  $('.book-file').textContent = pdf
  $('.book-matches').innerHTML = matches
    .map((match) => `<span>${match}</span>`)
    .join('')

  container.append(element)
}

function getResults(query, options) {
  const results = this.search(query, options)

  for (const result of results) {
    const { pdf, image, score, match } = result
    const matches = Object.keys(match)
    const title = pdf

    renderItem({ title, image, pdf, score, matches })
  }
}

createSearch()
  .then((minisearch) => {
    const search = getResults.bind(minisearch)

    form.classList.remove('disabled')
    form.addEventListener('submit', (e) => {
      e.preventDefault()

      const data = new FormData(form)
      const query = data.get('query')

      container.replaceChildren()
      search(query)
    })
  })
  .catch(console.error)
