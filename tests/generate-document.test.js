const generateDocumentFunc = require('../GenerateDocument')
const { writeFile } = require('fs').promises
const { join } = require('path')

const testDocumentsTypes = [
  'acos-innplasseringsbrev',
  'iop-hemmelig',
  'minelev-notat-notat',
  'minelev-samtale-hemmelig',
  'minelev-samtale-ikkesamtale',
  'minelev-samtale-samtale',
  'minelev-varsel-atferd',
  'minelev-varsel-fag',
  'minelev-varsel-foresatte',
  'minelev-varsel-hemmelig',
  'minelev-varsel-orden',
  'minelev-yff-bekreftelse-bedrift',
  'minelev-yff-bekreftelse',
  'minelev-yff-hemmelig',
  'minelev-yff-laereplan',
  'minelev-yff-tilbakemelding',
  'smart-motereferat',
  'smart-motereferatV2',
  'vigo-KONTRAKT-response'
]
const context = { log: console.log, invocationId: 'testing' }
const req = { url: 'http://localhost/api/Generate' }

describe('GenerateDocument function test', () => {
  it('returns 400 when no body was provided', async () => {
    const result = await generateDocumentFunc(context, req)
    expect(result).toMatchObject({
      status: 400,
      body: { error: { message: 'No request body received!' } }
    })
  })

  it('returns 400 if schema validation fails', async () => {
    const result = await generateDocumentFunc(context, { ...req, body: {} })
    expect(result).toMatchObject({
      status: 400,
      body: { error: { message: 'Invalid request body' } }
    })
  })

  it('returns 404 if template wasn\'t found', async () => {
    const result = await generateDocumentFunc(context, { ...req, body: { system: 'minelev', template: 'not-found' } })
    expect(result).toMatchObject({
      status: 404,
      body: { error: { message: 'Template not found!' } }
    })
  })

  testDocumentsTypes.forEach(type => {
    const testDocument = require(`./data/${type}.json`)
    it(`${type} :: can parse and write returned base64 to .pdf file correctly`, async () => {
      const document = await generateDocumentFunc(context, { ...req, body: testDocument })
      const { base64 } = document.body.data
      await expect(typeof base64).toBe('string')

      const buffer = Buffer.from(base64, 'base64')
      await expect(buffer.byteLength).toBeGreaterThan(15000)

      await writeFile(join(__dirname, `./data/${type}.pdf`), buffer)
    })
  })
})
