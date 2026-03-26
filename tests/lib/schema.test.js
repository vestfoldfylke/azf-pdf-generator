const { test, describe } = require("node:test")
const assert = require("node:assert")
const HTTPError = require("../../lib/http-error")
const validateSchema = require("../../lib/validate-schema")

const getValidationInnerError = (data, schema) => {
  try {
    return validateSchema(data, schema)
  } catch (error) {
    return error.innerError
  }
}

const validSchema = {
  system: "minelev",
  template: "varsel/fag",
  type: "",
  version: ""
}

describe("Validate document schema", () => {
  test("throws when nothing is passed", () => {
    assert.throws(() => validateSchema(), HTTPError)
  })

  test("throws when null is passed", () => {
    assert.throws(() => validateSchema(null), HTTPError)
  })

  test("throws when template isn't found", () => {
    assert.throws(() => validateSchema(validSchema, "not-found"))
  })

  test("fails on validation when system is missing", () => {
    assert.deepStrictEqual(getValidationInnerError({ template: "sak" }).summary, ["Missing required property 'system'"])
  })

  test("fails on validation when template is missing", () => {
    assert.deepStrictEqual(getValidationInnerError({ system: "ting" }).summary, ["Missing required property 'template'"])
  })

  test("fails on validation when wrong type is passed", () => {
    assert.deepStrictEqual(getValidationInnerError({ system: "sak", template: true }).summary, ["Property undefined should be of type string"])
  })

  test("returns language 'nb', empty data object, type '' and version '' when it isn't passed", () => {
    const schema = { ...validSchema }
    validateSchema(schema)
    assert.deepStrictEqual(schema, { ...schema, data: {}, language: "nb" })
  })

  test("returns language 'nb', empty data object, type '2' and version 'B' when it is passed", () => {
    const schema = { ...validSchema, type: "2", version: "B" }
    validateSchema(schema)
    assert.deepStrictEqual(schema, { ...schema, data: {}, language: "nb" })
  })
})
