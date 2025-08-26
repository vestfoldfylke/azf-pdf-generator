const { logger } = require('@vtfk/logger')
const { readFile } = require('fs').promises
const HTTPError = require('./http-error')

const defaultLanguage = 'nb'

/**
 * Returns the template from the given system and template name
 *
 * @param system {string} - The system the template belongs to
 * @param template {string} - The name/path of the template
 * @param [language=nb] {string} - The language of the template (default is nb)
 * @returns {Promise<string>} The template as a string
 * @throws {HTTPError} Throws 404 error if template is not found
 */
async function getTemplate (system, template, language = defaultLanguage) {
  const tempName = `templates/${system}/${template}-${language}.md`
  try {
    return await readFile(tempName, 'utf-8')
  } catch (error) {
    logger('warn', ['get-template', `Could not find ${tempName}. Will try fallback`])
  }

  const fallback = `templates/${system}/${template}-${defaultLanguage}.md`
  try {
    return await readFile(fallback, 'utf-8')
  } catch (error) {
    logger('warn', ['get-template', `Could not find fallback template ${fallback} either!`])
    throw new HTTPError(404, 'Template not found!', { system, template, language })
  }
}

module.exports = getTemplate
