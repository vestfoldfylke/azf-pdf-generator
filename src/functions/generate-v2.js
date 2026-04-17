const { app } = require("@azure/functions")
const { logger } = require("@vestfoldfylke/loglady")
const Sjablong = require("@vtfk/sjablong")
const merge = require("lodash.merge")
const { prettifyBytes } = require("../../lib/prettify-bytes")
const { GeneratePDFFromHTML } = require("../../lib/pdf-generate-v2/pdfgenerator.js")
const getDocumentDefinition = require("../../lib/document-definitions/index")
const errorHandling = require("../../lib/error-handling")
const HTTPError = require("../../lib/http-error")

const decodeBase64 = (encodedString) => {
  if (!encodedString) {
    throw new Error("No input string provided")
  }

  const buff = Buffer.from(encodedString, "base64")
  return buff.toString("utf8")
}

const generateV2 = async (request, _context) => {
  logger.info("start")

  const body = await request.json().catch(() => null)

  if (!body) {
    throw new HTTPError(400, "Request is empty")
  }

  if (!body.template) {
    throw new HTTPError(400, "You have to provide template to generate PDF", "No template is provided")
  }

  const template = decodeBase64(body.template)

  let combinedMetadata = {}

  const schema = Sjablong.generateSchema(template)
  const schemaDefaults = Sjablong.createObjectFromSchema(schema, true, body.preview)
  if (schemaDefaults) {
    combinedMetadata = schemaDefaults
  }

  if (body.data) {
    combinedMetadata = merge(combinedMetadata, body.data)
  }

  if (!body.preview) {
    Sjablong.validateData(schema, combinedMetadata)
  }
  const replaced = Sjablong.replacePlaceholders(template, combinedMetadata, { preview: body.preview })

  const markdownContent = Sjablong.getHTMLandMetadataFromMarkdown(replaced)

  if (markdownContent?.metadata) {
    combinedMetadata = merge(markdownContent.metadata, combinedMetadata)
  }

  const documentDefinitionId = body.documentDefinitionId || combinedMetadata.documentDefinitionId || combinedMetadata.definition
  let documentDefinition
  let documentStyles
  if (documentDefinitionId) {
    const [definition, defaultStyles] = getDocumentDefinition(documentDefinitionId, combinedMetadata.language || "nb")

    if (!definition) {
      throw new HTTPError(404, `Could not find document definition '${documentDefinitionId}'`)
    }

    if (!defaultStyles) {
      throw new HTTPError(404, `Could not find styles for document definition '${documentDefinitionId}'`)
    }

    documentDefinition = definition
    documentStyles = defaultStyles
  }

  const documentBuffer = await GeneratePDFFromHTML(markdownContent.html, documentDefinition, documentStyles, combinedMetadata)
  logger.info("returning document - size {size}", prettifyBytes(Buffer.byteLength(documentBuffer)))

  return {
    jsonBody: {
      data: combinedMetadata,
      base64: documentBuffer.toString("base64")
    }
  }
}

const handler = (request, context) => errorHandling(request, context, generateV2)

app.http("GenerateV2", {
  methods: ["POST"],
  authLevel: "function",
  route: "generatev2",
  handler
})

module.exports = handler
