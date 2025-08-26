const { logger } = require('@vtfk/logger')
const { htmlStyles } = require('./shared/style')
const HTTPError = require('../http-error')

const defaultLanguage = 'nb'

/**
 * Returns function for selected document definition and override html styles (for html-to-pdfmake)
 * @param {string} id The id for document definition
 * @param {string} language The language for the definition in ISO 639-1 format.
 * @returns {[Function, {}]} definition, overrideStyles
 * @throws {HTTPError} Throws 404 error if definition is not found
 */
function getDocumentDefinition (id, language = defaultLanguage) {
  const definition = `./definitions/${id}-${language}`
  try {
    return [require(definition), htmlStyles]
  } catch (error) {
    logger('warn', ['document-definitions', `Could not find document definition '${definition}'. Will try fallback`])
  }

  const fallback = `./definitions/${id}-${defaultLanguage}`
  try {
    return [require(fallback), htmlStyles]
  } catch (error) {
    logger('warn', ['document-definitions', `Could not find fallback document definition '${definition}' either!`])
    throw new HTTPError(404, 'Document definition not found!', { id, language })
  }
}

module.exports = getDocumentDefinition
