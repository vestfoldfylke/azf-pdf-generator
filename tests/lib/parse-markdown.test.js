const { test, describe } = require("node:test")
const assert = require("node:assert")
const parseMarkdown = require("../../lib/parse-markdown")

const frontmatter = `---
hello: World
complex-things:
  level: 1000
  difficulty: hard
---`
const frontmatterObject = {
  hello: "World",
  "complex-things": {
    level: 1000,
    difficulty: "hard"
  }
}

const markdown = "# Hi!\n\nWhat's up?"
const markdownHtml = "<h1>Hi!</h1>\n<p>What's up?</p>"

describe("Parse markdown", () => {
  test("doesn't throw when parsing valid markdown", () => {
    assert.doesNotThrow(() => parseMarkdown(markdown))
  })

  test("parses markdown to correct html", () => {
    const { html } = parseMarkdown(markdown)
    assert.ok(html.includes(markdownHtml))
  })

  test("parses frontmatter yaml to correct object", () => {
    const { metadata } = parseMarkdown(frontmatter)
    assert.deepStrictEqual(metadata, frontmatterObject)
  })

  test("parses returns correct data when metadata and frontmatter is passed together", () => {
    const { html, metadata } = parseMarkdown(`${frontmatter}\n${markdown}`)
    assert.strictEqual(html, markdownHtml)
    assert.deepStrictEqual(metadata, frontmatterObject)
  })
})
