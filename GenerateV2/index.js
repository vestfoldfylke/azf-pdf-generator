const Sjablong = require('@vtfk/sjablong')
const merge = require('lodash.merge')
const { prettifyBytes } = require('../lib/prettify-bytes')
const { logger } = require('@vtfk/logger')
const PDFGenerator = require('../lib/pdf-generate-v2/pdfgenerator.js')
const getDocumentDefinition = require('../lib/document-definitions/index')
const errorHandling = require('../lib/error-handling')
const HTTPError = require('../lib/http-error')

const decodeBase64 = (encodedString) => {
  // Input validation
  if (!encodedString) {
    throw new Error('No input string provided')
  }

  // Create buffer from base64
  const buff = Buffer.from(encodedString, 'base64')
  // Output as utf-8
  return buff.toString('utf8')
}

const generateV2 = async (context, req) => {
  logger('info', 'start')

  // Input validation
  if (!req || !req.body) {
    throw new HTTPError(400, 'Request is empty')
  }

  // Determine what template text to use
  if (!req.body.template) {
    throw new HTTPError(400, 'You have to provide template to generate PDF', 'No template is provided')
  }

  // Decode the template received in the request
  const template = decodeBase64(req.body.template)

  // CombinedMetadata - this will be a combination of req.body.data, schemaDefaults and markdownContent.metadata
  let combinedMetadata = {}

  // Generate schema and extract any default values from it
  const schema = Sjablong.generateSchema(template)
  const schemaDefaults = Sjablong.createObjectFromSchema(schema, true, req.body.preview)
  if (schemaDefaults) {
    combinedMetadata = schemaDefaults
  }

  // Combine the schema default data with req.body.data if applicable
  if (req.body.data) {
    combinedMetadata = merge(combinedMetadata, req.body.data)
  }

  // Validate the data against the schema
  if (!req.body.preview) {
    Sjablong.validateData(schema, combinedMetadata)
  }
  // Replace all placeholder values in the template
  const replaced = Sjablong.replacePlaceholders(template, combinedMetadata, { preview: req.body.preview })

  // Convert the template to HTML
  const markdownContent = Sjablong.getHTMLandMetadataFromMarkdown(replaced)

  // Combine the metadata again if applicable
  if (markdownContent && markdownContent.metadata) {
    combinedMetadata = merge(markdownContent.metadata, combinedMetadata)
  }

  // Attempt to get the document template definition
  const documentDefinitionId = req.body.documentDefinitionId || combinedMetadata.documentDefinitionId || combinedMetadata.definition
  let documentDefinition
  let documentStyles
  if (documentDefinitionId) {
    const [definition, defaultStyles] = getDocumentDefinition(documentDefinitionId, combinedMetadata.language || 'nb')

    if (!definition) {
      throw new HTTPError(404, `Could not find document definition '${documentDefinitionId}'`)
    }

    if (!defaultStyles) {
      throw new HTTPError(404, `Could not find styles for document definition '${documentDefinitionId}'`)
    }

    documentDefinition = definition
    documentStyles = defaultStyles
  }

  // Generate the PDF
  const documentBuffer = await PDFGenerator.GeneratePDFFromHTML(markdownContent.html, documentDefinition, documentStyles, combinedMetadata)
  logger('info', ['returning document', 'size', prettifyBytes(Buffer.byteLength(documentBuffer))])

  return {
    body: {
      data: combinedMetadata,
      base64: documentBuffer.toString('base64')
    }
  }
}

module.exports = async (context, req) => await errorHandling(context, req, generateV2)
