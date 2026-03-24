// src/providers/metadata/cosmosApi.snippets.ts

import { CosmosFunctionSnippet } from './metadataSchema'

type SnippetMap = Record<string, Record<string, CosmosFunctionSnippet>>

export const cosmosSnippets: SnippetMap = {
  context: {
    getContext: {
      js: {
        prefix: 'cosmos.getContext',
        description: 'Get the current execution context',
        body: ['const context = getContext()'],
      },
      ts: {
        prefix: 'cosmos.getContext',
        description: 'Get the current execution context',
        body: ['const context = getContext()'],
      },
    },

    getCollection: {
      js: {
        prefix: 'cosmos.getCollection',
        description: 'Get the collection interface',
        body: ['const collection = getContext().getCollection()'],
      },
      ts: {
        prefix: 'cosmos.getCollection',
        description: 'Get the collection interface',
        body: ['const collection = getContext().getCollection()'],
      },
    },

    getRequest: {
      js: {
        prefix: 'cosmos.getRequest',
        description: 'Get the request interface',
        body: ['const request = getContext().getRequest()'],
      },
      ts: {
        prefix: 'cosmos.getRequest',
        description: 'Get the request interface',
        body: ['const request = getContext().getRequest()'],
      },
    },

    getResponse: {
      js: {
        prefix: 'cosmos.getResponse',
        description: 'Get the response interface',
        body: ['const response = getContext().getResponse()'],
      },
      ts: {
        prefix: 'cosmos.getResponse',
        description: 'Get the response interface',
        body: ['const response = getContext().getResponse()'],
      },
    },
  },

  collection: {
    queryDocuments: {
      js: {
        prefix: 'cosmos.queryDocuments',
        description: 'Query documents in the current collection',
        body: [
          'const context = getContext()',
          'const collection = context.getCollection()',
          '',
          'const query = \'SELECT * FROM c WHERE c.type = @type\'',
          'const params = [{ name:\'@type\', value:\'example\' }]',
          '',
          'collection.queryDocuments(',
          '  collection.getSelfLink(),',
          '  { query:query, parameters:params },',
          '  {},',
          '  function onQuery(err, docs, info) {',
          '    if (err) throw err',
          '    // handle docs',
          '  }',
          ')',
        ],
      },
      ts: {
        prefix: 'cosmos.queryDocuments',
        description: 'Query documents in the current collection',
        body: [
          'const context = getContext()',
          'const collection = context.getCollection()',
          '',
          'const query = \'SELECT * FROM c WHERE c.type = @type\'',
          'const params = [{ name: \'@type\', value: \'example\' }]',
          '',
          'collection.queryDocuments(',
          '  collection.getSelfLink(),',
          '  { query: query, parameters: params },',
          '  {},',
          '  function onQuery(err: any, docs: any[], info: any): void {',
          '    if (err) throw err',
          '    // handle docs',
          '  }',
          ')',
        ],
      },
    },

    createDocument: {
      js: {
        prefix: 'cosmos.createDocument',
        description: 'Create a document',
        body: [
          'const context = getContext()',
          'const collection = context.getCollection()',
          '',
          'const doc = { id:\'myDoc\', value:123 }',
          '',
          'collection.createDocument(',
          '  collection.getSelfLink(),',
          '  doc,',
          '  {},',
          '  function onCreate(err, created) {',
          '    if (err) throw err',
          '    // handle created document',
          '  }',
          ')',
        ],
      },
      ts: {
        prefix: 'cosmos.createDocument',
        description: 'Create a document',
        body: [
          'const context = getContext()',
          'const collection = context.getCollection()',
          '',
          'const doc = { id: \'myDoc\', value: 123 }',
          '',
          'collection.createDocument(',
          '  collection.getSelfLink(),',
          '  doc,',
          '  {},',
          '  function onCreate(err: any, created: any): void {',
          '    if (err) throw err',
          '    // handle created document',
          '  }',
          ')',
        ],
      },
    },

    readDocument: {
      js: {
        prefix: 'cosmos.readDocument',
        description: 'Read a document',
        body: [
          'const context = getContext()',
          'const collection = context.getCollection()',
          '',
          'collection.readDocument(',
          '  documentLink,',
          '  {},',
          '  function onRead(err, doc) {',
          '    if (err) throw err',
          '    // handle doc',
          '  }',
          ')',
        ],
      },
      ts: {
        prefix: 'cosmos.readDocument',
        description: 'Read a document',
        body: [
          'const context = getContext()',
          'const collection = context.getCollection()',
          '',
          'collection.readDocument(',
          '  documentLink,',
          '  {},',
          '  function onRead(err: any, doc: any): void {',
          '    if (err) throw err',
          '    // handle doc',
          '  }',
          ')',
        ],
      },
    },

    replaceDocument: {
      js: {
        prefix: 'cosmos.replaceDocument',
        description: 'Replace a document',
        body: [
          'const context = getContext()',
          'const collection = context.getCollection()',
          '',
          'const updated = { value:999 }',
          '',
          'collection.replaceDocument(',
          '  documentLink,',
          '  updated,',
          '  {},',
          '  function onReplace(err, doc) {',
          '    if (err) throw err',
          '    // handle updated doc',
          '  }',
          ')',
        ],
      },
      ts: {
        prefix: 'cosmos.replaceDocument',
        description: 'Replace a document',
        body: [
          'const context = getContext()',
          'const collection = context.getCollection()',
          '',
          'const updated = { value: 999 }',
          '',
          'collection.replaceDocument(',
          '  documentLink,',
          '  updated,',
          '  {},',
          '  function onReplace(err: any, doc: any): void {',
          '    if (err) throw err',
          '    // handle updated doc',
          '  }',
          ')',
        ],
      },
    },

    deleteDocument: {
      js: {
        prefix: 'cosmos.deleteDocument',
        description: 'Delete a document',
        body: [
          'const context = getContext()',
          'const collection = context.getCollection()',
          '',
          'collection.deleteDocument(',
          '  documentLink,',
          '  {},',
          '  function onDelete(err) {',
          '    if (err) throw err',
          '    // document deleted',
          '  }',
          ')',
        ],
      },
      ts: {
        prefix: 'cosmos.deleteDocument',
        description: 'Delete a document',
        body: [
          'const context = getContext()',
          'const collection = context.getCollection()',
          '',
          'collection.deleteDocument(',
          '  documentLink,',
          '  {},',
          '  function onDelete(err: any): void {',
          '    if (err) throw err',
          '    // document deleted',
          '  }',
          ')',
        ],
      },
    },

    upsertDocument: {
      js: {
        prefix: 'cosmos.upsertDocument',
        description: 'Upsert a document',
        body: [
          'const context = getContext()',
          'const collection = context.getCollection()',
          '',
          'const doc = { id:\'myDoc\', value:123 }',
          '',
          'collection.upsertDocument(',
          '  collection.getSelfLink(),',
          '  doc,',
          '  {},',
          '  function onUpsert(err, result) {',
          '    if (err) throw err',
          '    // handle result',
          '  }',
          ')',
        ],
      },
      ts: {
        prefix: 'cosmos.upsertDocument',
        description: 'Upsert a document',
        body: [
          'const context = getContext()',
          'const collection = context.getCollection()',
          '',
          'const doc = { id: \'myDoc\', value: 123 }',
          '',
          'collection.upsertDocument(',
          '  collection.getSelfLink(),',
          '  doc,',
          '  {},',
          '  function onUpsert(err: any, result: any): void {',
          '    if (err) throw err',
          '    // handle result',
          '  }',
          ')',
        ],
      },
    },
  },

  request: {
    getBody: {
      js: {
        prefix: 'cosmos.getBody',
        description: 'Get the request body',
        body: ['const body = getContext().getRequest().getBody()'],
      },
      ts: {
        prefix: 'cosmos.getBody',
        description: 'Get the request body',
        body: ['const body: any = getContext().getRequest().getBody()'],
      },
    },

    setBody: {
      js: {
        prefix: 'cosmos.setRequestBody',
        description: 'Set the request body',
        body: ['getContext().getRequest().setBody({ updated:true })'],
      },
      ts: {
        prefix: 'cosmos.setRequestBody',
        description: 'Set the request body',
        body: ['getContext().getRequest().setBody({ updated: true })'],
      },
    },

    getValue: {
      js: {
        prefix: 'cosmos.getValue',
        description: 'Get the request value',
        body: ['const value = getContext().getRequest().getValue()'],
      },
      ts: {
        prefix: 'cosmos.getValue',
        description: 'Get the request value',
        body: ['const value: any = getContext().getRequest().getValue()'],
      },
    },

    setValue: {
      js: {
        prefix: 'cosmos.setValue',
        description: 'Set the request value',
        body: ['getContext().getRequest().setValue(\'new value\')'],
      },
      ts: {
        prefix: 'cosmos.setValue',
        description: 'Set the request value',
        body: ['getContext().getRequest().setValue(\'new value\')'],
      },
    },
  },

  response: {
    setStatusCode: {
      js: {
        prefix: 'cosmos.setStatusCode',
        description: 'Set the response status code',
        body: ['getContext().getResponse().setStatusCode(200)'],
      },
      ts: {
        prefix: 'cosmos.setStatusCode',
        description: 'Set the response status code',
        body: ['getContext().getResponse().setStatusCode(200)'],
      },
    },

    setBody: {
      js: {
        prefix: 'cosmos.setResponseBody',
        description: 'Set the response body',
        body: ['getContext().getResponse().setBody({ ok:true })'],
      },
      ts: {
        prefix: 'cosmos.setResponseBody',
        description: 'Set the response body',
        body: ['getContext().getResponse().setBody({ ok: true })'],
      },
    },

    getBody: {
      js: {
        prefix: 'cosmos.getResponseBody',
        description: 'Get the response body',
        body: ['const body = getContext().getResponse().getBody()'],
      },
      ts: {
        prefix: 'cosmos.getResponseBody',
        description: 'Get the response body',
        body: ['const body: any = getContext().getResponse().getBody()'],
      },
    },
  },
}
