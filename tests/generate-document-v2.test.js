const assert = require("node:assert")
const { writeFile } = require("node:fs").promises
const { join } = require("node:path")
const { test, describe } = require("node:test")
const generateV2Func = require("../src/functions/generate-v2")

const testDocumentsTypes = ["planoppstart"]

const makeRequest = (body) => {
  if (body === undefined) {
    return new Request("http://localhost/api/generatev2", { method: "POST" })
  }
  return new Request("http://localhost/api/generatev2", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" }
  })
}

const context = { log: console.log, invocationId: "testing" }

describe("GenerateV2 function test", () => {
  test("returns 400 when no body was provided", async () => {
    const result = await generateV2Func(makeRequest(), context)
    assert.strictEqual(result.status, 400)
    assert.strictEqual(result.jsonBody.error.message, "Request is empty")
  })

  test("returns 400 if schema validation fails", async () => {
    const result = await generateV2Func(makeRequest({}), context)
    assert.strictEqual(result.status, 400)
    assert.strictEqual(result.jsonBody.error.message, "You have to provide template to generate PDF")
  })

  testDocumentsTypes.forEach((type) => {
    const testDocument = require(`./data-v2/${type}.json`)
    test(`${type} :: can parse and write returned base64 to .pdf file correctly`, async () => {
      const document = await generateV2Func(makeRequest(testDocument.body), context)
      const { base64 } = document.jsonBody
      assert.strictEqual(typeof base64, "string")

      const buffer = Buffer.from(base64, "base64")
      assert.ok(buffer.byteLength > 15000)

      await writeFile(join(__dirname, `./data-v2/${type}.pdf`), buffer)
    })
  })
})
