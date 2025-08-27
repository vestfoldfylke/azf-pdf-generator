/*
  Import dependencies
*/
const htmlToPdfMake = require('html-to-pdfmake')
const { JSDOM } = require('jsdom') // Virtual DOM for javascript, nødvendig for htmlToPdfMake
const { superPdfMake } = require('../pdfmake/index.js')
const { window } = new JSDOM() // Initialiserer JSDOM

/**
 * Generates PDF documents
 */
class PDFGenerator {
  /**
   *
   * @param {string} contentHTML The PDF content formatted as HTML
   * @param {function} pdfmakeDefinition pdfmake document definition (https://pdfmake.github.io/docs/0.1/document-definition-object/)
   * @param {object} pdfmakeStyle pdfmake document style (https://pdfmake.github.io/docs/0.1/document-definition-object/styling/)
   * @param {object} data A data object that might be used to replace placeholders in the pdfmakeDefinition
   * @returns Returns the PDF document in Base64 encoding
   * @throws Error on invalid input
   */
  static async GeneratePDFFromHTML (contentHTML, pdfmakeDefinition = undefined, pdfmakeStyle = undefined, data = undefined) {
    // Input validation
    if (pdfmakeDefinition && typeof pdfmakeDefinition !== 'function') {
      throw new Error('PDF document definition is provided, but is not of type function')
    }

    if (pdfmakeStyle && typeof pdfmakeStyle !== 'object') {
      throw new Error('PDF document style is provided, but is not of type object')
    }

    // Generate PDF Document-content from HTML
    const pdfDocumentContent = htmlToPdfMake(contentHTML, { window, defaultStyles: pdfmakeStyle })

    // Generate the PDF from the above content
    let pdfDocumentDefinition
    if (pdfmakeDefinition) {
      // If pdfMakeDefinition-function is provided, use that to generate the PDF
      pdfDocumentDefinition = pdfmakeDefinition({ metadata: data, content: pdfDocumentContent })
    } else {
      // If no definition is provided, create a blanc one
      pdfDocumentDefinition = {
        pageSize: 'A4',
        pageOrientation: 'portrait',
        content: pdfDocumentContent
      }
    }

    // Generate the PDF-data to buffer
    const options = {
      version: 'B',
      type: 2
    }

    return await superPdfMake(pdfDocumentDefinition, options)
  }
}

module.exports = PDFGenerator
