const Handlebars = require('handlebars')
const htmlToPdfMake = require('html-to-pdfmake')
const { JSDOM } = require('jsdom')
const getDefinition = require('./document-definitions/index')
const { window } = new JSDOM('')
const parseMarkdown = require('./parse-markdown')
const helpers = require('./helpers')

/**
 * Generates document from template and data
 * @param template {string} - String of handlebars template
 * @param data {object} - Data object
 * @returns {object} Document definition ready for pdfMake
 */
function buildDocument (template, data) {
  Handlebars.registerHelper(helpers)
  const templateGenerator = Handlebars.compile(template)
  const markdown = templateGenerator(data)

  const { html, metadata } = parseMarkdown(markdown)
  const [definition, defaultStyles] = getDefinition(metadata.definition, metadata.language)
  const content = htmlToPdfMake(html, { window, defaultStyles })
  return definition({ metadata, data, content })
}

module.exports = buildDocument
