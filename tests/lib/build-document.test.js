const buildDocument = require('../../lib/generate-document')

const testTemplate = '---\ndefinition: brevmal\nlanguage: nb\n---\n# Hello, {{ name }}!'
const testData = { name: 'Kjell' }

const build = () => buildDocument(testTemplate, testData)

describe('Build document', () => {
  it('doesn\'t throw when building document', () => {
    expect(() => build()).not.toThrow()
  })

  it('returned document is an object', () => {
    const document = build()
    expect(typeof document).toBe('object')
  })

  it('returned document can be converted to JSON', () => {
    const document = build()
    expect(() => JSON.stringify(document)).not.toThrow()
  })

  it('returned document contains \'Hello, Kjell!\', so we know that handlebars did it\'s job', () => {
    const document = build()
    expect(JSON.stringify(document)).toContain('Hello, Kjell!')
  })
})
