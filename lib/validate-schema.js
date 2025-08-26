const { logger } = require('@vtfk/logger')
const HTTPError = require('./http-error')

const Ajv = require('ajv').default
const ajv = new Ajv({ allErrors: true, useDefaults: true })

const repackAjvError = (error) => {
  const { keyword, params, dataPath, message } = error

  if (keyword === 'required') return `Missing required property '${params.missingProperty}'`
  if (keyword === 'type') return `Property ${dataPath} should be of type ${params.type}`
  return message
}

/**
 * Validate body against <b>schemaName</b> - Will add any missing non-required properties to <b>body</b> 😬
 * @param body {object} - the request body to validate
 * @param [schemaName] {string} - the name of the schema to validate against (default: 'document')
 * @throws {HTTPError} - Throws 400 error if the body is missing or invalid
 */
module.exports = (body, schemaName = 'document') => {
  if (!body) {
    throw new HTTPError(400, 'No request body received!')
  }

  const schema = require(`../models/${schemaName}.json`)
  const validate = ajv.compile(schema)
  const valid = validate(body)

  if (!valid) {
    const validationErrors = validate.errors.map(repackAjvError)
    logger('warn', ['validate-schema', 'schema validation failed', validationErrors.join(', ')])
    throw new HTTPError(400, 'Invalid request body', { summary: validationErrors, schemaErrors: validate.errors })
  }
}
