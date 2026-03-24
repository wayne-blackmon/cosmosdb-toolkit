// src/snippets/sprocs.ts

export interface SprocSnippet {
  prefix: string
  description: string
  body: string[]
}

export const sprocSnippets: SprocSnippet[] = [
  //
  // 1. BASIC STORED PROCEDURE
  //
  {
    prefix: 'cosmos.sproc.basic',
    description: 'Basic Cosmos DB stored procedure template',
    body: [
      'export function ${1:storedProcedure}(input) {',
      '  const context = getContext()',
      '  const collection = context.getCollection()',
      '  const response = context.getResponse()',
      '',
      '  // TODO: implement logic',
      '  response.setBody({ ok: true, input })',
      '}',
    ],
  },

  //
  // 2. CONTINUATION QUERY LOOP
  //
  {
    prefix: 'cosmos.sproc.continuation',
    description: 'Continuation-aware query loop for Cosmos DB',
    body: [
      'export function ${1:continuationQuery}(input) {',
      '  const context = getContext()',
      '  const collection = context.getCollection()',
      '  const response = context.getResponse()',
      '',
      '  const query = \'${2:SELECT * FROM c}\'',
      '  const options = { pageSize: ${3:100} }',
      '',
      '  let results = []',
      '',
      '  const run = (continuation) => {',
      '    const accepted = collection.queryDocuments(',
      '      collection.getSelfLink(),',
      '      query,',
      '      { ...options, continuation },',
      '      (err, docs, info) => {',
      '        if (err) throw err',
      '',
      '        results = results.concat(docs)',
      '',
      '        if (info.continuation) {',
      '          run(info.continuation)',
      '        } else {',
      '          response.setBody(results)',
      '        }',
      '      }',
      '    )',
      '',
      '    if (!accepted) throw new Error(\'Query not accepted by server\')',
      '  }',
      '',
      '  run()',
      '}',
    ],
  },

  //
  // 3. BULK INSERT
  //
  {
    prefix: 'cosmos.sproc.bulk',
    description: 'Bulk insert stored procedure',
    body: [
      'export function ${1:bulkInsert}(docs) {',
      '  const context = getContext()',
      '  const collection = context.getCollection()',
      '  const response = context.getResponse()',
      '',
      '  let index = 0',
      '  const total = docs.length',
      '',
      '  const insertNext = () => {',
      '    if (index >= total) {',
      '      response.setBody({ inserted: total })',
      '      return',
      '    }',
      '',
      '    const doc = docs[index]',
      '',
      '    const accepted = collection.createDocument(',
      '      collection.getSelfLink(),',
      '      doc,',
      '      (err) => {',
      '        if (err) throw err',
      '        index++',
      '        insertNext()',
      '      }',
      '    )',
      '',
      '    if (!accepted) throw new Error(\'Insert not accepted by server\')',
      '  }',
      '',
      '  insertNext()',
      '}',
    ],
  },

  //
  // 4. HYBRID QUERY + WRITE
  //
  {
    prefix: 'cosmos.sproc.hybrid',
    description: 'Query documents then write results',
    body: [
      'export function ${1:hybridSproc}(input) {',
      '  const context = getContext()',
      '  const collection = context.getCollection()',
      '  const response = context.getResponse()',
      '',
      '  const query = \'${2:SELECT * FROM c WHERE c.type = @type}\'',
      '  const params = [{ name: \'@type\', value: input.type }]',
      '',
      '  const accepted = collection.queryDocuments(',
      '    collection.getSelfLink(),',
      '    { query, parameters: params },',
      '    (err, docs) => {',
      '      if (err) throw err',
      '',
      '      const newDoc = {',
      '        id: input.id,',
      '        count: docs.length,',
      '        timestamp: new Date().toISOString()',
      '      }',
      '',
      '      const ok = collection.createDocument(',
      '        collection.getSelfLink(),',
      '        newDoc,',
      '        (err2) => {',
      '          if (err2) throw err2',
      '          response.setBody(newDoc)',
      '        }',
      '      )',
      '',
      '      if (!ok) throw new Error(\'Create not accepted by server\')',
      '    }',
      '  )',
      '',
      '  if (!accepted) throw new Error(\'Query not accepted by server\')',
      '}',
    ],
  },

  //
  // 5. PRE-TRIGGER TEMPLATE
  //
  {
    prefix: 'cosmos.sproc.trigger.pre',
    description: 'Pre-trigger template',
    body: [
      'export function ${1:preTrigger}(doc) {',
      '  const context = getContext()',
      '  const request = context.getRequest()',
      '',
      '  // Modify the document before write',
      '  doc.modifiedAt = new Date().toISOString()',
      '',
      '  request.setBody(doc)',
      '}',
    ],
  },

  //
  // 6. POST-TRIGGER TEMPLATE
  //
  {
    prefix: 'cosmos.sproc.trigger.post',
    description: 'Post-trigger template',
    body: [
      'export function ${1:postTrigger}() {',
      '  const context = getContext()',
      '  const response = context.getResponse()',
      '',
      '  const body = response.getBody()',
      '',
      '  // Modify the response after write',
      '  const wrapped = {',
      '    timestamp: new Date().toISOString(),',
      '    result: body',
      '  }',
      '',
      '  response.setBody(wrapped)',
      '}',
    ],
  },

  //
  // 7. UDF TEMPLATE
  //
  {
    prefix: 'cosmos.udf',
    description: 'User-defined function template',
    body: [
      'export function ${1:udfName}(${2:value}) {',
      '  // Pure function — no context access allowed',
      '  return ${2:value}',
      '}',
    ],
  },
]
