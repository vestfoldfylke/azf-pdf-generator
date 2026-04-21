const { app } = require("@azure/functions")
const { logger } = require("@vestfoldfylke/loglady")
const { prettifyBytes } = require("../../lib/prettify-bytes")
const errorHandling = require("../../lib/error-handling")
const { superPdfMake } = require("../../lib/pdfmake/index.js")
const validateSchema = require("../../lib/validate-schema")
const getResponseObject = require("../../lib/get-response-object")
const getTemplate = require("../../lib/get-template")
const generateDocument = require("../../lib/generate-document")
const getPdfmakeOptions = require("../../lib/get-pdfmake-options")

const generate = async (request, _context) => {
  logger.info("start")

  const body = await request.json().catch(() => null)
  validateSchema(body)
  const { system, template, language, type, version, data } = body

  const templateString = await getTemplate(system, template, language)
  const document = generateDocument(templateString, data)
  const options = getPdfmakeOptions(type, version)
  const documentBuffer = await superPdfMake(document, options)

  logger.info("returning document - {system} - {template} - size {size}", system, template, prettifyBytes(Buffer.byteLength(documentBuffer)))
  return getResponseObject({ ...body, base64: documentBuffer.toString("base64") })
}

const handler = (request, context) => errorHandling(request, context, generate)

app.http("GenerateDocument", {
  methods: ["POST"],
  authLevel: "function",
  route: "generate",
  handler
})

module.exports = handler
