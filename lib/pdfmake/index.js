const PdfPrinter = require('pdfmake')
const path = require('path')

const fonts = {
  Nunito: {
    normal: path.join(__dirname, '.', 'fonts/Nunito/Nunito-Regular.ttf'),
    bold: path.join(__dirname, '.', 'fonts/Nunito/Nunito-Bold.ttf'),
    italics: path.join(__dirname, '.', 'fonts/Nunito/Nunito-RegularItalic.ttf'),
    bolditalics: path.join(__dirname, '.', 'fonts/Nunito/Nunito-BoldItalic.ttf')
  },
  'Nunito Sans': {
    normal: path.join(__dirname, '.', 'fonts/Nunito_Sans/NunitoSans-Regular.ttf'),
    bold: path.join(__dirname, '.', 'fonts/Nunito_Sans/NunitoSans-Bold.ttf'),
    italics: path.join(__dirname, '.', 'fonts/Nunito_Sans/NunitoSans-RegularItalic.ttf'),
    bolditalics: path.join(__dirname, '.', 'fonts/Nunito_Sans/NunitoSans-BoldItalic.ttf')
  },
  Roboto: {
    normal: path.join(__dirname, '.', 'fonts/Roboto-Regular.ttf'),
    bold: path.join(__dirname, '.', 'fonts/Roboto-Medium.ttf'),
    italics: path.join(__dirname, '.', 'fonts/Roboto-Italic.ttf'),
    bolditalics: path.join(__dirname, '.', 'fonts/Roboto-MediumItalic.ttf')
  },
  Courier: {
    normal: 'Courier',
    bold: 'Courier-Bold',
    italics: 'Courier-Oblique',
    bolditalics: 'Courier-BoldOblique'
  },
  Helvetica: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique'
  },
  Times: {
    normal: 'Times-Roman',
    bold: 'Times-Bold',
    italics: 'Times-Italic',
    bolditalics: 'Times-BoldItalic'
  },
  Symbol: {
    normal: 'Symbol'
  },
  ZapfDingbats: {
    normal: 'ZapfDingbats'
  }
}

const printer = new PdfPrinter(fonts)

const getDoc = pdfDoc => {
  const chunks = []
  return new Promise((resolve, reject) => {
    pdfDoc.on('data', chunk => chunks.push(chunk))
    pdfDoc.on('end', () => resolve(Buffer.concat(chunks)))
    pdfDoc.on('error', error => reject(error))
    pdfDoc.end()
  })
}

const pdfAType = '2'
const pdfAVersion = 'B'

/**
 * @typedef {Object} SuperPDFMakeOptions
 * @property {'2' | 2} [type] The PDF version. Required to enable PDF/A formatting
 * @property {'B'} [version] The PDF type. Required to enable PDF/A formatting
 */

/**
 *
 * @param {import('pdfmake/interfaces').TDocumentDefinitions} doc
 * @param {SuperPDFMakeOptions} options
 * @returns {Promise<Buffer>}
 */
const superPdfMake = (doc, options) => {
  if (!doc) {
    throw new Error('Missing required input: doc')
  }
  if (options && typeof options === 'object') {
    if ((options.type && !options.version) || (!options.type && options.version)) {
      throw new Error('Both options.type and options.version must be provided to enable PDF/A formatting')
    }
    if (options.type && options.version) {
      if (options.type.toString() !== pdfAType || options.version !== pdfAVersion) {
        throw new Error(`Invalid options.type and options.version combination. Supported combination is type ${pdfAType} and version ${pdfAVersion} - haha`)
      }
      doc.version = '1.7' // Hakke peil på hva forskjell er, annet enn at alt nyere enn default 1.3 er nødvendig for PDF/A
      doc.subset = 'PDF/A-2b'
      doc.tagged = true
    }
  }
  const pdfDoc = printer.createPdfKitDocument(doc)

  return getDoc(pdfDoc)
}

module.exports = { superPdfMake }
