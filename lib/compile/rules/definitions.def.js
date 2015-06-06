{{## def.setup:keyword:
  {{ 
    var $lvl = it.level
      , $dataLvl = it.dataLevel
      , $schema = it.schema[keyword]
      , $schemaPath = it.schemaPath + '.' + keyword;

    var $data = 'data' + $dataLvl
      , $valid = 'valid' + $lvl
      , $errs = 'errs' + $lvl;
  }}
#}}


{{## def.setupNextLevel:
  {{
    var $it = it.copy(it)
      , $closingBraces = ''
      , $breakOnError = !it.opts.allErrors;
    $it.level++;
  }}
#}}


{{## def.ifValid:
  {{? $breakOnError }}
    if ({{=$valid}}) {
    {{ $closingBraces += '}'; }}
  {{?}}
#}}


{{## def.ifResultValid:
  {{? $breakOnError }}
    if (valid{{=$it.level}}) {
    {{ $closingBraces += '}'; }}
  {{?}}
#}}


{{## def.elseIfValid:
  {{? $breakOnError }}
    {{ $closingBraces += '}'; }}
    else {
  {{?}}
#}}


{{## def.strLength:
  {{? it.opts.unicode === false }}
    {{=$data}}.length
  {{??}}
    ucs2length({{=$data}})
  {{?}}
#}}


{{## def.cleanUp:
  {{ out = out.replace(/if \(valid[0-9]*\) \{\s*\}/g, ''); }}
#}}


{{## def.error:rule:
  validate.errors.push({
    keyword: '{{=rule}}',
    dataPath: dataPath{{=$dataLvl}},
    message: {{# def._errorMessages[rule] }}
    {{? it.opts.verbose }}, schema: {{# def._errorSchemas[rule] }}, data: {{=$data}}{{?}}
  });
#}}


{{## def.checkError:rule:
  if (!{{=$valid}}) {{# def.error:rule }}
#}}


{{## def._errorMessages = {
  $ref:            "'can\\\'t resolve reference {{=$schema}}'",
  additionalItems: "'should NOT have more than {{=$schema.length}} items'",
  additionalProperties: "'additional properties NOT allowed'",
  dependencies:    "'{{? $deps.length == 1 }}property {{= $deps[0] }} is{{??}}properties {{= $deps.join(\", \") }} are{{?}} required when property {{= $property }} is present'",
  enum:            "'should be equal to one of values'",
  format:          "'should match format {{=$schema}}'",
  maximum:         "'should be {{=$op}} {{=$schema}}'",
  minimum:         "'should be {{=$op}} {{=$schema}}'",
  maxItems:        "'should NOT have more than {{=$schema}} items'",
  minItems:        "'should NOT have less than {{=$schema}} items'",
  maxLength:       "'should NOT be longer than {{=$schema}} characters'",
  minLength:       "'should NOT be shorter than {{=$schema}} characters'",
  maxProperties:   "'should NOT have more than {{=$schema}} properties'",
  minProperties:   "'should NOT have less than {{=$schema}} properties'",
  multipleOf:      "'should be multiple of {{=$schema}}'",
  not:             "'should NOT be valid'",
  oneOf:           "'should match exactly one schema in oneOf'",
  pattern:         "'should match pattern \"{{=$schema}}\"'",
  required:        "'properties {{=$schema.slice(0,7).join(\", \") }}{{? $schema.length > 7}}...{{?}} are required'",
  type:            "'should be {{? $isArray }}{{= $schema.join(\",\") }}{{??}}{{=$schema}}{{?}}'",
  uniqueItems:     "'items ## ' + j + ' and ' + i + ' are duplicate'"
} #}}


{{## def._errorSchemas = {
  $ref:            "'{{=$schema}}'",
  additionalItems: "false",
  additionalProperties: "false",
  dependencies:    "validate.schema{{=$schemaPath}}",
  enum:            "validate.schema{{=$schemaPath}}",
  format:          "'{{=$schema}}'",
  maximum:         "{{=$schema}}",
  minimum:         "{{=$schema}}",
  maxItems:        "{{=$schema}}",
  minItems:        "{{=$schema}}",
  maxLength:       "{{=$schema}}",
  minLength:       "{{=$schema}}",
  maxProperties:   "{{=$schema}}",
  minProperties:   "{{=$schema}}",
  multipleOf:      "{{=$schema}}",
  not:             "validate.schema{{=$schemaPath}}",
  oneOf:           "validate.schema{{=$schemaPath}}",
  pattern:         "'{{=$schema}}'",
  required:        "validate.schema{{=$schemaPath}}",
  type:            "{{? $isArray }}validate.schema{{=$schemaPath}}{{??}}'{{=$schema}}'{{?}}",
  uniqueItems:     "{{=$schema}}"
} #}}