const { test, describe } = require("node:test")
const assert = require("node:assert")
const getResponseObject = require("../../lib/get-response-object")

describe("Response Object tests", () => {
  test("loads method correctly", () => {
    assert.strictEqual(typeof getResponseObject, "function")
  })

  test("returns a proper response object for objects", () => {
    const response = { hello: "world" }
    const azureResponse = {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        data: response,
        count: undefined
      }
    }

    assert.deepStrictEqual(getResponseObject(response), azureResponse)
  })

  test("returns a proper response object for arrays", () => {
    const response = [{ hello: "world" }, { hello: "there" }]
    const azureResponse = {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        data: response,
        count: 2
      }
    }

    assert.deepStrictEqual(getResponseObject(response), azureResponse)
  })

  test("returns correct default status code", () => {
    const response = getResponseObject({})
    assert.strictEqual(response.status, 200)
  })

  test("returns correct status code when provided", () => {
    const response = getResponseObject({}, 500)
    assert.strictEqual(response.status, 500)
  })
})
