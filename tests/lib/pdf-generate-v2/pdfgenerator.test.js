const { test, describe } = require('node:test')
const assert = require('node:assert')
const PDFGenerator = require('../../../lib/pdf-generate-v2/pdfgenerator.js')
const { readFileSync } = require('node:fs')

describe('Generate PDF Document from HTML', () => {
  test('Generate from valid HTML', async () => {
    const html = readFileSync('./tests/lib/pdf-generate-v2/data/validHTML.html', 'utf-8')
    const PDF = await PDFGenerator.GeneratePDFFromHTML(html)
    assert.ok(PDF)
  })
  test('Generate from invalid HTML', async () => {
    const invalidHtml = readFileSync('./tests/lib/pdf-generate-v2/data/invalidHTML.html', 'utf-8')
    const PDF = await PDFGenerator.GeneratePDFFromHTML(invalidHtml)
    assert.ok(PDF) // WHOOOOPS, shit in - shit out
  })
})
