const prettifyBytes = (number) => {
  if (typeof number !== 'bigint' && !Number.isFinite(number)) {
    throw new Error(`Expected a finite number, got ${typeof number}: ${number}`)
  }

  const UNITS = [
    'B',
    'kB',
    'MB',
    'GB',
    'TB',
    'PB',
    'EB',
    'ZB',
    'YB'
  ]

  const separator = ' '

  const isNegative = number < 0
  const prefix = isNegative ? '-' : ''

  if (isNegative) {
    number = -number
  }

  if (number < 1) {
    const numberString = number.toString()
    return prefix + numberString + separator + UNITS[0]
  }

  const exponent = Math.min(Math.floor(Math.log10(number) / 3), UNITS.length - 1)
  number = number / (1000 ** exponent)

  const minPrecision = Math.max(3, Number.parseInt(number, 10).toString().length)
  number = number.toPrecision(minPrecision)

  const numberString = Number(number).toString()

  const unit = UNITS[exponent]

  return prefix + numberString + separator + unit
}

module.exports = { prettifyBytes }
