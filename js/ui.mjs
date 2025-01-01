import createSearch from './search.mjs'

const container = document.querySelector('.book-list')
/** @type {HTMLTemplateElement} */
const template = document.querySelector('#book-item-template').cloneNode(true)

const input = document.querySelector('input')
const form = document.querySelector('form')
const message = document.querySelector('#result-message')

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
  $('.book-title').href = pdf
  $('.book-description').textContent = description + '...'
  $('.book-file').textContent = pdf
  $('.book-matches').innerHTML = matches
    .map((match) => `<button onclick="searchQuery(this)">${match}</button>`)
    .join('')

  container.append(element)
}

function getResults(query, options) {
  const start = Date.now()
  const results = this.search(query, options)

  for (const result of results) {
    const matches = Object.keys(result.match)

    renderItem({ ...result, matches })
  }

  const time = (Date.now() - start) / 10
  message.textContent = `Ditemukan ${results.length} dokumen dalam ${time} detik.`
}

/**
  * @param {HTMLButtonElement} button
  */
function searchQuery(button) {
  input.value = button.textContent
  input.scrollIntoView({ behavior: 'smooth' })
  form.querySelector('button').click()
}

input.value = decodeURI(location.search).match(/search=([^&]+)/)?.[1] ?? ''
window.searchQuery = searchQuery

createSearch()
  .then((minisearch) => {
    const search = getResults.bind(minisearch)

    if (input.value) search(input.value)

    input.placeholder = 'Cari teks dari dokumen...'
    form.classList.remove('disabled')
    form.addEventListener('submit', (e) => {
      e.preventDefault()

      const data = new FormData(form)
      const query = data.get('query')

      history.replaceState('', '', '?search=' + query)
      container.replaceChildren()
      search(query)
    })
  })
  .catch(console.error)
