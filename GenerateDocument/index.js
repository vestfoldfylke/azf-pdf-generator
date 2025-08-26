const { logger } = require('@vtfk/logger')
const { prettifyBytes } = require('../lib/prettify-bytes')
const errorHandling = require('../lib/error-handling')
const { superPdfMake } = require('../lib/pdfmake/index.js')
const validateSchema = require('../lib/validate-schema')
const getResponseObject = require('../lib/get-response-object')
const getTemplate = require('../lib/get-template')
const generateDocument = require('../lib/generate-document')
const getPdfmakeOptions = require('../lib/get-pdfmake-options')

const generate = async (context, req) => {
  logger('info', 'start')

  validateSchema(req.body)
  const { system, template, language, type, version, data } = req.body

  const templateString = await getTemplate(system, template, language)
  const document = generateDocument(templateString, data)
  const options = getPdfmakeOptions(type, version)
  const documentBuffer = await superPdfMake(document, options)

  logger('info', ['returning document', system, template, 'size', prettifyBytes(Buffer.byteLength(documentBuffer))])
  return getResponseObject({ ...req.body, base64: documentBuffer.toString('base64') })
}

module.exports = async (context, req) => await errorHandling(context, req, generate)
