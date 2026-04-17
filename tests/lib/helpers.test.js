const assert = require("node:assert")
const { test, describe } = require("node:test")
const {
  isoDate,
  prettyDate,
  lowercase,
  join,
  uppercase,
  variable,
  eq,
  ne,
  lt,
  gt,
  lte,
  gte,
  and,
  or,
  multiple,
  replace,
  capitalize,
  uppercaseFirst,
  objectContains,
  classIdentifier
} = require("../../lib/helpers")

describe("Test helper - logic", () => {
  const options = {}

  test("eq / ===", () => {
    assert.strictEqual(eq("Hei", "Hade"), false)
    assert.strictEqual(eq("Hei", "Hei"), true)
  })

  test("ne / !==", () => {
    assert.strictEqual(ne("Hei", "Hade"), true)
    assert.strictEqual(ne("Hei", "Hei"), false)
  })

  test("lt / <", () => {
    assert.strictEqual(lt(3, 10), true)
    assert.strictEqual(lt(42, 4), false)
  })

  test("gt / >", () => {
    assert.strictEqual(gt(3, 10), false)
    assert.strictEqual(gt(42, 4), true)
  })

  test("lte / <=", () => {
    assert.strictEqual(lte(10, 10), true)
    assert.strictEqual(lte(4, 42), true)
    assert.strictEqual(lte(6, 5), false)
  })

  test("gte / >=", () => {
    assert.strictEqual(gte(10, 10), true)
    assert.strictEqual(gte(6, 5), true)
    assert.strictEqual(gte(4, 42), false)
  })

  test("and / &&", () => {
    assert.strictEqual(and(true, "hei", options), true)
    assert.strictEqual(and(false, "", options), false)
    assert.strictEqual(and(true, false, false, true, options), false)
  })

  test("or / ||", () => {
    assert.strictEqual(or("", "hei", options), true)
    assert.strictEqual(or(false, "", options), false)
    assert.strictEqual(or(false, false, false, true, options), true)
  })
})

describe("Test helper - variable", () => {
  test("assigns handlebars variable", () => {
    const options = { data: { root: {} } }
    variable("VAR", "Er no tull!", options)
    assert.strictEqual(options.data.root.VAR, "Er no tull!")
  })
})

describe("Test helper - multiple", () => {
  test("returns false on no value", () => {
    assert.strictEqual(multiple(), false)
  })

  test("returns false on empty array", () => {
    assert.strictEqual(multiple([]), false)
  })

  test("returns false on array with empty object", () => {
    assert.strictEqual(multiple([{}]), false)
  })

  test("returns false on single value", () => {
    assert.strictEqual(multiple(["Gro"]), false)
  })

  test("returns true on multiple values", () => {
    assert.strictEqual(multiple(["Gro", "Kåre"]), true)
  })
})

describe("Test helper - replace", () => {
  test("returns correctly replaced value", () => {
    assert.strictEqual(replace("hei", "hade", "hei på deg"), "hade på deg")
  })

  test("returns input if nothing was replaced", () => {
    assert.strictEqual(replace("hei", "hade", "god helg"), "god helg")
  })

  test("returns nothing if nothing is to be replaced", () => {
    assert.strictEqual(replace("hei", "hade"), "")
  })
})

describe("Test helper - isoDate", () => {
  test("returns correct ISO-date from timestamp", () => {
    const date = new Date()
    assert.strictEqual(isoDate(date.getTime()), date.toISOString())
  })

  test("returns input if passed string isn't a valid date", () => {
    assert.strictEqual(isoDate("test"), "test")
  })
})

describe("Test helper - prettyDate", () => {
  test("returns correctly formatted date from timestamp", () => {
    assert.strictEqual(prettyDate(1610036019845), "07.01.2021")
  })

  test("returns input if passed string isn't a valid date", () => {
    assert.strictEqual(prettyDate("test"), "test")
  })
})

describe("Test helper - capitalize", () => {
  test("returns capitalized data", () => {
    assert.strictEqual(capitalize("heLlo"), "Hello")
  })

  test("returns empty string if input is an empty string", () => {
    assert.strictEqual(capitalize(""), "")
  })

  test("returns empty string if input isn't a string", () => {
    assert.strictEqual(capitalize({}), "")
  })
})

describe("Test helper - uppercaseFirst", () => {
  test("returns large first character data", () => {
    assert.strictEqual(uppercaseFirst("heLlo"), "HeLlo")
  })

  test("returns empty string if input is an empty string", () => {
    assert.strictEqual(uppercaseFirst(""), "")
  })

  test("returns empty string if input isn't a string", () => {
    assert.strictEqual(uppercaseFirst({}), "")
  })
})

describe("Test helper - uppercase", () => {
  test("returns uppercase date", () => {
    assert.strictEqual(uppercase("heLlo"), "HELLO")
  })

  test("returns empty string if input isn't a string", () => {
    assert.strictEqual(uppercase({}), "")
  })
})

describe("Test helper - lowercase", () => {
  test("returns lowercased date", () => {
    assert.strictEqual(lowercase("HELLO"), "hello")
  })

  test("returns empty string if input isn't a string", () => {
    assert.strictEqual(lowercase({}), "")
  })
})

describe("Test helper - join", () => {
  test("returns empty string on no input", () => {
    assert.strictEqual(join(), "")
  })

  test("returns empty string if input isn't a string", () => {
    assert.strictEqual(join(true), "")
  })

  test("returns empty string on empty array", () => {
    assert.strictEqual(join([]), "")
  })

  test("returns simple value on one input", () => {
    assert.strictEqual(join(["Ape"]), "Ape")
  })

  test("returns joined value on two inputs", () => {
    assert.strictEqual(join(["Ape", "Banan"]), "Ape og Banan")
  })

  test("returns joined value with comma on three or more inputs", () => {
    assert.strictEqual(join(["Ape", "Banan", "Kake"]), "Ape, Banan og Kake")
    assert.strictEqual(join(["Ape", "Banan", "Kake", "Marsipan"]), "Ape, Banan, Kake og Marsipan")
  })

  test("returns value joined with custom last part", () => {
    assert.strictEqual(join(["Ape", "Banan"], "eller"), "Ape eller Banan")
  })

  test("filters out empty values", () => {
    assert.strictEqual(join(["Ape", "", "Banan", "", ""]), "Ape og Banan")
  })
})

describe("Test helper - objectContains", () => {
  const obj = {
    id: 1,
    nb: "Du har manglende vurderingsgrunnlag",
    nn: "Du har manglande vurderingsgrunnlag",
    en: "You have a lack of assessments"
  }

  test("returns false on no input", () => {
    assert.strictEqual(objectContains(), false)
  })

  test("returns true on empty input", () => {
    assert.strictEqual(objectContains([]), true)
  })

  test("returns true on valid input and text found", () => {
    assert.strictEqual(objectContains(obj, "vurderingsgrunnlag"), true)
  })

  test("returns false on valid input and text not found", () => {
    assert.strictEqual(objectContains(obj, "heihei"), false)
  })
})

describe("Test helper - classIdentifier", () => {
  test('returns "nb" from class object when it exists', () => {
    const obj = {
      id: "01234567",
      name: "TEST/201NOR1208",
      nb: "Norsk hovedmål, skriftlig",
      nn: "Norsk hovudmål, skriftleg",
      en: "Norwegian as 1st lang, written"
    }
    const identifier = classIdentifier(obj.nb, obj.name)
    assert.strictEqual(identifier, obj.nb)
  })

  test('returns "name" from class object when "nb" doesnt exist', () => {
    const obj = {
      id: "76543210",
      name: "TEST/201NOR1209"
    }
    const identifier = classIdentifier(obj.nb, obj.name)
    assert.strictEqual(identifier, obj.name)
  })
})
