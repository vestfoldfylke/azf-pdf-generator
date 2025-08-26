const generateV2Func = require('../GenerateV2')
const { writeFile } = require('fs').promises
const { join } = require('path')

const testDocumentsTypes = ['planoppstart']
const context = { log: console.log, invocationId: 'testing' }
const req = { url: 'http://localhost/api/GenerateV2' }

describe('GenerateV2 function test', () => {
  it('returns 400 when no body was provided', async () => {
    const result = await generateV2Func(context, req)
    expect(result).toMatchObject({
      status: 400,
      body: { error: { message: 'Request is empty' } }
    })
  })

  it('returns 400 if schema validation fails', async () => {
    const result = await generateV2Func(context, { ...req, body: {} })
    expect(result).toMatchObject({
      status: 400,
      body: { error: { message: 'You have to provide template to generate PDF' } }
    })
  })

  testDocumentsTypes.forEach(type => {
    const testDocument = require(`./data-v2/${type}.json`)
    it(`${type} :: can parse and write returned base64 to .pdf file correctly`, async () => {
      const document = await generateV2Func(context, { ...req, body: testDocument.body })
      const { base64 } = document.body
      expect(typeof base64).toBe('string')

      const buffer = Buffer.from(base64, 'base64')
      expect(buffer.byteLength).toBeGreaterThan(15000)

      await writeFile(join(__dirname, `./data-v2/${type}.pdf`), buffer)
    })
  })
})
