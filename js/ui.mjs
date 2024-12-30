import createSearch from './search.mjs'

const container = document.querySelector('.book-list')
/** @type {HTMLTemplateElement} */
const template = document.querySelector('#book-item-template').cloneNode(true)

const input = document.querySelector('input')
const form = document.querySelector('form')

/**
 * @param {Object} metadata
 * @param {string} metadata.title
 * @param {string} metadata.description
 * @param {string} metadata.image
 * @param {string} metadata.pdf
 * @param {string|number} metadata.score
 * @param {string[]} metadata.matches
 */
function renderItem({ title, description, image, pdf, score, matches }) {
  /** @type {HTMLDivElement} */
  const element = template.cloneNode(true)
  /** @type {HTMLElement['querySelector']} */
  const $ = element.querySelector.bind(element)

  element.id = ''
  $('img').src = image
  $('.book-score').textContent = score
  $('.book-title').textContent = title
  $('.book-description').textContent = description + '...'
  $('.book-file').textContent = pdf
  $('.book-matches').innerHTML = matches
    .map((match) => `<button onclick="searchQuery(this)">${match}</button>`)
    .join('')

  container.append(element)
}

function getResults(query, options) {
  const results = this.search(query, options)

  for (const result of results) {
    const matches = Object.keys(result.match)

    renderItem({ ...result, matches })
  }
}

/**
  * @param {HTMLButtonElement} button
  */
function searchQuery(button) {
  input.value = button.textContent
  input.scrollIntoView({ behavior: 'smooth' })
}

window.searchQuery = searchQuery

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
