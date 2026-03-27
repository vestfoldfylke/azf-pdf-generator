const { test, describe } = require("node:test")
const assert = require("node:assert")
const generateV2Func = require("../GenerateV2")
const { writeFile } = require("node:fs").promises
const { join } = require("node:path")

const testDocumentsTypes = ["planoppstart"]
const context = { log: console.log, invocationId: "testing" }
const req = { url: "http://localhost/api/GenerateV2" }

describe("GenerateV2 function test", () => {
  test("returns 400 when no body was provided", async () => {
    const result = await generateV2Func(context, req)
    assert.strictEqual(result.status, 400)
    assert.strictEqual(result.body.error.message, "Request is empty")
  })

  test("returns 400 if schema validation fails", async () => {
    const result = await generateV2Func(context, { ...req, body: {} })
    assert.strictEqual(result.status, 400)
    assert.strictEqual(result.body.error.message, "You have to provide template to generate PDF")
  })

  testDocumentsTypes.forEach((type) => {
    const testDocument = require(`./data-v2/${type}.json`)
    test(`${type} :: can parse and write returned base64 to .pdf file correctly`, async () => {
      const document = await generateV2Func(context, { ...req, body: testDocument.body })
      const { base64 } = document.body
      assert.strictEqual(typeof base64, "string")

      const buffer = Buffer.from(base64, "base64")
      assert.ok(buffer.byteLength > 15000)

      await writeFile(join(__dirname, `./data-v2/${type}.pdf`), buffer)
    })
  })
})
