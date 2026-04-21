const assert = require("node:assert")
const { writeFile } = require("node:fs").promises
const { join } = require("node:path")
const { test, describe } = require("node:test")
const generateDocumentFunc = require("../src/functions/generate-document")

const testDocumentsTypes = [
  "acos-innplasseringsbrev",
  "iop-hemmelig",
  "minelev-notat-notat",
  "minelev-samtale-hemmelig",
  "minelev-samtale-ikkesamtale",
  "minelev-samtale-samtale",
  "minelev-varsel-atferd",
  "minelev-varsel-fag",
  "minelev-varsel-foresatte",
  "minelev-varsel-hemmelig",
  "minelev-varsel-orden",
  "minelev-yff-bekreftelse-bedrift",
  "minelev-yff-bekreftelse",
  "minelev-yff-hemmelig",
  "minelev-yff-laereplan",
  "minelev-yff-tilbakemelding",
  "smart-motereferat",
  "smart-motereferatV2",
  "vigo-KONTRAKT-response"
]

const makeRequest = (body) => {
  if (body === undefined) {
    return new Request("http://localhost/api/generate", { method: "POST" })
  }
  return new Request("http://localhost/api/generate", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" }
  })
}

const context = { log: console.log, invocationId: "testing" }

describe("GenerateDocument function test", () => {
  test("returns 400 when no body was provided", async () => {
    const result = await generateDocumentFunc(makeRequest(), context)
    assert.strictEqual(result.status, 400)
    assert.strictEqual(result.jsonBody.error.message, "No request body received!")
  })

  test("returns 400 if schema validation fails", async () => {
    const result = await generateDocumentFunc(makeRequest({}), context)
    assert.strictEqual(result.status, 400)
    assert.strictEqual(result.jsonBody.error.message, "Invalid request body")
  })

  test("returns 404 if template wasn't found", async () => {
    const result = await generateDocumentFunc(makeRequest({ system: "minelev", template: "not-found" }), context)
    assert.strictEqual(result.status, 404)
    assert.strictEqual(result.jsonBody.error.message, "Template not found!")
  })

  testDocumentsTypes.forEach((type) => {
    const testDocument = require(`./data/${type}.json`)
    test(`${type} :: can parse and write returned base64 to .pdf file correctly`, async () => {
      const document = await generateDocumentFunc(makeRequest(testDocument), context)
      const { base64 } = document.jsonBody.data
      assert.strictEqual(typeof base64, "string")

      const buffer = Buffer.from(base64, "base64")
      assert.ok(buffer.byteLength > 15000)

      await writeFile(join(__dirname, `./data/${type}.pdf`), buffer)
    })
  })
})
