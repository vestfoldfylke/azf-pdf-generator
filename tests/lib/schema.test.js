const HTTPError = require('../../lib/http-error')
const validateSchema = require('../../lib/validate-schema')

const getValidationInnerError = (data, schema) => {
  try {
    return validateSchema(data, schema)
  } catch (error) {
    return error.innerError
  }
}

const validSchema = {
  system: 'minelev',
  template: 'varsel/fag',
  type: '',
  version: ''
}

describe('Validate document schema', () => {
  it('throws when nothing is passed', () => {
    expect(() => validateSchema()).toThrow(HTTPError)
  })

  it('throws when null is passed', () => {
    expect(() => validateSchema(null)).toThrow(HTTPError)
  })

  it('throws when template isn\'t found', () => {
    expect(() => validateSchema(validSchema, 'not-found')).toThrow()
  })

  it('fails on validation when system is missing', () => {
    expect(getValidationInnerError({ template: 'sak' }).summary)
      .toEqual(["Missing required property 'system'"])
  })

  it('fails on validation when template is missing', () => {
    expect(getValidationInnerError({ system: 'ting' }).summary)
      .toEqual(["Missing required property 'template'"])
  })

  it('fails on validation when wrong type is passed', () => {
    expect(getValidationInnerError({ system: 'sak', template: true }).summary)
      .toEqual(['Property undefined should be of type string'])
  })

  it('returns language \'nb\', empty data object, type \'\' and version \'\' when it isn\'t passed', () => {
    const schema = { ...validSchema }
    validateSchema(schema)
    expect(schema).toEqual({ ...schema, data: {}, language: 'nb' })
  })

  it('returns language \'nb\', empty data object, type \'2\' and version \'B\' when it is passed', () => {
    const schema = { ...validSchema, type: '2', version: 'B' }
    validateSchema(schema)
    expect(schema).toEqual({ ...schema, data: {}, language: 'nb' })
  })
})
