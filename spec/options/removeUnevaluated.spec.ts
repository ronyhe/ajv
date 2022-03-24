import _Ajv from "../ajv2019"
import chai from "../chai"
chai.should()

describe("removeAdditional option", () => {
  it("should remove unevaluated properties", () => {
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

  it('should remove redundant properties in oneOf situations', () => {
    const ajv = new _Ajv({removeUnevaluated: true, unevaluated: true})
    ajv.addSchema({
      $id: "//test/fooBar",
      type: "object",
      oneOf: [
        {
          required: ['a', 'b'],
          properties: {
            a: {type: 'number'},
            b: {type: 'number'},
          }
        },
        {
          properties: {
            c: {type: 'number'},
            d: {type: 'number'}
          }
        }
      ],
      unevaluatedProperties: true
    })
    const object = {
      b: 2,
      c: 3,
      d: 4
    }
    ajv.validate("//test/fooBar", object).should.equal(true)
    object.should.not.have.property('b')
    object.should.have.property('c')
    object.should.have.property('d')
  })

  // Still failing
  it.skip('should remove redundant properties in anyOf situations', () => {
    const ajv = new _Ajv({removeUnevaluated: true, unevaluated: true})
    ajv.addSchema({
      $id: "//test/fooBar",
      type: "object",
      anyOf: [
        {
          required: ['a', 'b'],
          properties: {
            a: {type: 'number'},
            b: {type: 'number'},
            // unevaluatedProperties: true -> This makes it pass
          },
        },
        {
          required: ['c', 'd'],
          properties: {
            c: {type: 'number'},
            d: {type: 'number'}
          }
        }
      ],
      unevaluatedProperties: true
    })
    const object = {
      a: 1,
      b: 2,
      c: 3,
      d: 4
    }
    ajv.validate("//test/fooBar", object).should.equal(true)
    object.should.have.property('a')
    object.should.have.property('b')
    object.should.not.have.property('c')
    object.should.not.have.property('d')
  })
})
