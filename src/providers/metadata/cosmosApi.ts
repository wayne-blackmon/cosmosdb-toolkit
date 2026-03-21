// src/providers/metadata/cosmosApi.ts

import { CosmosApi } from './metadataSchema'

export const cosmosApi: CosmosApi = {
  context: {
    label: 'IContext',
    functions: [
      {
        label: 'getContext',
        detail: 'Returns the context object.',
        documentation: 'Entry point for all server-side operations.',
        signatures: [
          {
            label: 'getContext(): IContext',
            parameters: [],
            returns: 'IContext',
            documentation: 'Returns the current execution context.'
          }
        ],
        examples: ['// Example: const ctx = getContext()'],
        related: ['getCollection', 'getRequest', 'getResponse'],
        notes: ['This is typically the first call in a server-side script.'],
        snippet: {
          prefix: 'cosmos.getContext',
          description: 'Get the current execution context',
          body: ['const context = getContext()']
        }
      },
      {
        label: 'getCollection',
        detail: 'Returns the collection object.',
        documentation: 'Provides access to CRUD and query operations.',
        signatures: [
          {
            label: 'getCollection(): ICollection',
            parameters: [],
            returns: 'ICollection',
            documentation: 'Retrieves the collection interface for document operations.'
          }
        ],
        examples: ['// Example: const col = getContext().getCollection()'],
        related: ['queryDocuments', 'createDocument', 'readDocument'],
        notes: ['Used for all document-level operations.']
      },
      {
        label: 'getRequest',
        detail: 'Returns the request object.',
        documentation: 'Provides access to the incoming request.',
        signatures: [
          {
            label: 'getRequest(): IRequest',
            parameters: [],
            returns: 'IRequest',
            documentation: 'Retrieves the incoming request object.'
          }
        ],
        examples: ['// Example: const req = getContext().getRequest()'],
        related: ['getBody', 'getValue'],
        notes: ['Useful for reading input passed to the script.']
      },
      {
        label: 'getResponse',
        detail: 'Returns the response object.',
        documentation: 'Used to set the response body and status code.',
        signatures: [
          {
            label: 'getResponse(): IResponse',
            parameters: [],
            returns: 'IResponse',
            documentation: 'Retrieves the outgoing response object.'
          }
        ],
        examples: ['// Example: const res = getContext().getResponse()'],
        related: ['setBody', 'setStatusCode'],
        notes: ['Used to control the output returned to the client.']
      }
    ]
  },

  collection: {
    label: 'ICollection',
    functions: [
      {
        label: 'queryDocuments',
        detail: 'Query documents in the collection.',
        documentation: 'Executes a SQL query against the collection.',
        signatures: [
          {
            label: 'queryDocuments(link, filter, options, callback?)',
            parameters: [
              { name: 'link', type: 'string', documentation: 'Collection link.' },
              { name: 'filter', type: 'any', documentation: 'Query filter.' },
              { name: 'options', type: 'IRequestOptions', optional: true },
              { name: 'callback', type: 'callback', optional: true }
            ],
            returns: 'boolean',
            documentation: 'Queries documents with optional continuation.'
          }
        ],
        examples: ['collection.queryDocuments(link, query, options, callback)'],
        related: ['createDocument', 'readDocument'],
        notes: ['Supports continuation tokens.'],
        snippet: {
          prefix: 'cosmos.query',
          description: 'Query documents with continuation support',
          body: [
            'collection.queryDocuments(',
            '  ${1:collectionLink},',
            '  { query: \'${2:SELECT * FROM c}\', parameters: ${3:[]} },',
            '  ${4:options},',
            '  function(err, docs, info) {',
            '    if (err) throw err;',
            '    ${5:// handle docs}',
            '  }',
            ')'
          ]
        }
      },
      {
        label: 'createDocument',
        detail: 'Create a new document.',
        documentation: 'Creates a document in the collection.',
        signatures: [
          {
            label: 'createDocument(link, body, options, callback?)',
            parameters: [
              { name: 'link', type: 'string', documentation: 'Collection link.' },
              { name: 'body', type: 'any', documentation: 'Document body.' },
              { name: 'options', type: 'IRequestOptions', optional: true },
              { name: 'callback', type: 'callback', optional: true }
            ],
            returns: 'boolean'
          }
        ],
        examples: ['collection.createDocument(link, doc, options, callback)'],
        related: ['readDocument', 'replaceDocument'],
        notes: ['Returns false if the operation is async.']
      }
    ]
  },
  request: {
    label: 'IRequest',
    functions: [
      {
        label: 'getBody',
        detail: 'Get the request body.',
        documentation: 'Returns the body of the incoming request.',
        signatures: [
          {
            label: 'getBody(): any',
            parameters: [],
            returns: 'any'
          }
        ],
        examples: ['const body = getContext().getRequest().getBody()'],
        related: ['getValue']
      },
      {
        label: 'getValue',
        detail: 'Get a request property.',
        documentation: 'Returns a named value from the request.',
        signatures: [
          {
            label: 'getValue(key)',
            parameters: [
              { name: 'key', type: 'string', documentation: 'Property name.' }
            ],
            returns: 'any'
          }
        ],
        examples: ['req.getValue("id")'],
        related: ['getBody']
      }
    ]
  },

  response: {
    label: 'IResponse',
    functions: [
      {
        label: 'setBody',
        detail: 'Set the response body.',
        documentation: 'Sets the outgoing response body.',
        signatures: [
          {
            label: 'setBody(body)',
            parameters: [
              { name: 'body', type: 'any', documentation: 'Response body.' }
            ],
            returns: 'void'
          }
        ],
        examples: ['res.setBody({ ok: true })'],
        related: ['setStatusCode']
      },
      {
        label: 'setStatusCode',
        detail: 'Set the response status code.',
        documentation: 'Sets the outgoing HTTP status code.',
        signatures: [
          {
            label: 'setStatusCode(code)',
            parameters: [
              { name: 'code', type: 'number', documentation: 'HTTP status code.' }
            ],
            returns: 'void'
          }
        ],
        examples: ['res.setStatusCode(200)'],
        related: ['setBody']
      }
    ]
  }
}
