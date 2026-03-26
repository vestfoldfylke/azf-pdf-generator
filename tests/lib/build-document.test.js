const { test, describe } = require('node:test')
const assert = require('node:assert')
const buildDocument = require('../../lib/generate-document')

const testTemplate = '---\ndefinition: brevmal\nlanguage: nb\n---\n# Hello, {{ name }}!'
const testData = { name: 'Kjell' }

const build = () => buildDocument(testTemplate, testData)

describe('Build document', () => {
  test('doesn\'t throw when building document', () => {
    assert.doesNotThrow(() => build())
  })

  test('returned document is an object', () => {
    const document = build()
    assert.strictEqual(typeof document, 'object')
  })

  test('returned document can be converted to JSON', () => {
    const document = build()
    assert.doesNotThrow(() => JSON.stringify(document))
  })

  test('returned document contains \'Hello, Kjell!\', so we know that handlebars did it\'s job', () => {
    const document = build()
    assert.ok(JSON.stringify(document).includes('Hello, Kjell!'))
  })
})
