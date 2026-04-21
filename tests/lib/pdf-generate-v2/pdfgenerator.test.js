const { readFileSync } = require("node:fs")
const assert = require("node:assert")
const { test, describe } = require("node:test")
const { GeneratePDFFromHTML } = require("../../../lib/pdf-generate-v2/pdfgenerator.js")

describe("Generate PDF Document from HTML", () => {
  test("Generate from valid HTML", async () => {
    const html = readFileSync("./tests/lib/pdf-generate-v2/data/validHTML.html", "utf-8")
    const PDF = await GeneratePDFFromHTML(html)
    assert.ok(PDF)
  })
  test("Generate from invalid HTML", async () => {
    const invalidHtml = readFileSync("./tests/lib/pdf-generate-v2/data/invalidHTML.html", "utf-8")
    const PDF = await GeneratePDFFromHTML(invalidHtml)
    assert.ok(PDF) // WHOOOOPS, shit in - shit out
  })
})
