module.exports = {
  pageBreakBefore: (currentNode) => currentNode.style && currentNode.style.indexOf("pdf-pagebreak-before") > -1
}
