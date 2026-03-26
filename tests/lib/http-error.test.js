const { test, describe } = require('node:test')
const assert = require('node:assert')
const HTTPError = require('../../lib/http-error')

describe('HTTPError tests', () => {
  test('loads correctly', () => {
    assert.strictEqual(typeof HTTPError, 'function')
  })

  const error = new HTTPError(500, 'Something is wrong!')

  test('should throw HTTPError', () => {
    const throwError = () => { throw error }
    assert.throws(throwError, HTTPError)
  })

  test('returns proper response object', () => {
    const response = {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        error: {
          innerError: undefined,
          statusCode: 500,
          message: 'Something is wrong!'
        }
      }
    }

    assert.deepStrictEqual(error.toJSON(), response)
  })

  const withInnerError = new HTTPError(500, 'Something is wrong!', { inner: 'error' })

  test('returns innerError when provided', () => {
    const response = {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        error: {
          statusCode: 500,
          message: 'Something is wrong!',
          innerError: { inner: 'error' }
        }
      }
    }

    assert.deepStrictEqual(withInnerError.toJSON(), response)
  })
})
