const { test, describe } = require("node:test")
const assert = require("node:assert")
const getTemplate = require("../../lib/get-template")

describe("Get template", () => {
  test("throws when system isn't found", async () => {
    await assert.rejects(getTemplate("not-found", "not-found"), { message: "Template not found!" })
  })

  test("throws when template isn't found", async () => {
    await assert.rejects(getTemplate("minelev", "not-found"), { message: "Template not found!" })
  })

  test("fallback to 'nb' when template for language isn't found", async () => {
    const result = await getTemplate("minelev", "varsel/fag", "en")
    assert.ok(result.includes("language: nb"))
  })

  test("returns template", async () => {
    const result = await getTemplate("minelev", "varsel/fag")
    assert.ok(result.includes("definition: brevmal"))
  })
})
