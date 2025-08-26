const { logConfig, logger } = require('@vtfk/logger')
const HTTPError = require('./http-error')

const getEndpoint = (url) => {
  const urlParts = url.split('/').map(part => part.toLowerCase())
  const apiIndex = urlParts.indexOf('api')
  if (apiIndex <= -1) {
    return url
  }

  return urlParts.slice(apiIndex + 1).join('/')
}

module.exports = async function (context, req, next) {
  try {
    logConfig({ azure: { context }, prefix: getEndpoint(req.url) })
    return await next(context, req)
  } catch (error) {
    if (error instanceof HTTPError) {
      logger('error', [req.method, req.url, error.statusCode.toString(), error.message, error.innerError, error.stack], context)
      return error.toJSON()
    }

    logger('error', [req.method, req.url, 500, error.message, error.stack], context)
    return new HTTPError(500, error.message || 'An unknown error occured', error).toJSON()
  }
}
