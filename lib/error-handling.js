const { logger } = require("@vestfoldfylke/loglady")
const HTTPError = require("./http-error")

const getEndpoint = (url) => {
  const urlParts = url.split("/").map((part) => part.toLowerCase())
  const apiIndex = urlParts.indexOf("api")
  if (apiIndex <= -1) {
    return url
  }

  return urlParts.slice(apiIndex + 1).join("/")
}

module.exports = async (context, req, next) => {
  try {
    logger.logConfig({
      contextId: context.invocationId,
      prefix: getEndpoint(req.url)
    })
    return await next(context, req)
  } catch (error) {
    if (error instanceof HTTPError) {
      logger.errorException(error, "HTTPError: {method} {url} {statusCode} {message}", req.method, req.url, error.statusCode, error.message)
      return error.toJSON()
    }

    logger.error("Unexpected error: {method} {url} 500 {message} {stack}", req.method, req.url, error.message, error.stack)
    return new HTTPError(500, error.message || "An unknown error occured", error).toJSON()
  }
}
