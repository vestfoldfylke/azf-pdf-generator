/**
 *
 * @param type {"1"|"2"} - The type of PDF to generate ("1" = ISO 19005-1 or "2" = ISO 19005-2)
 * @param version {"A"|"B"} - The version of PDF to generate ("A" = Accessible or "B" = Basic)
 * @returns {undefined|{type, version}}
 */
module.exports = (type = undefined, version = undefined) => {
  if (!type || !version) return undefined

  return {
    type,
    version
  }
}
