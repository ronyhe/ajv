import _Ajv from "../ajv2019"
import chai from "../chai"
chai.should()

describe("removeAdditional option", () => {
  it("should remove all additional properties", () => {
    const ajv = new _Ajv({removeUnevaluated: true, unevaluated: true})

    ajv.addSchema({
      $id: "//test/fooBar",
      type: "object",
      properties: {foo: {type: "string"}, bar: {type: "string"}},
      unevaluatedProperties: true
    })

    const object = {
      foo: "foo",
      bar: "bar",
      baz: "baz-to-be-removed",
    }

    ajv.validate("//test/fooBar", object).should.equal(true)
    object.should.have.property("foo")
    object.should.have.property("bar")
    object.should.not.have.property("baz")
  })
})
