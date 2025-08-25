const PDFGenerator = require('../../../lib/pdf-generate-v2/pdfgenerator.js')
const { readFileSync } = require('fs')

describe('Generate PDF Document from HTML', () => {
  test('Generate from valid HTML', async () => {
    const html = readFileSync('./tests/lib/pdf-generate-v2/data/validHTML.html', 'utf-8')
    const PDF = await PDFGenerator.GeneratePDFfromHTML(html)
    expect(PDF).toBeTruthy()
  })
  test('Generate from invalid HTML', async () => {
    const invalidHtml = readFileSync('./tests/lib/pdf-generate-v2/data/invalidHTML.html', 'utf-8')
    const PDF = await PDFGenerator.GeneratePDFfromHTML(invalidHtml)
    expect(PDF).toBeTruthy() // WHOOOOPS, shit in - shit out
  })
})
