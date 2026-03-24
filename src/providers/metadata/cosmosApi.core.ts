// src/providers/metadata/cosmosApi.core.ts

import { CosmosApi } from './metadataSchema.js'

export const cosmosApiCore: CosmosApi = {
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
            returns: 'IContext'
          }
        ],
        examples: ['// Example: const ctx = getContext()'],
        related: ['getCollection', 'getRequest', 'getResponse'],
        notes: ['This is typically the first call in a server-side script.']
      },
      {
        label: 'getCollection',
        detail: 'Returns the collection object.',
        documentation: 'Provides access to CRUD and query operations.',
        signatures: [
          {
            label: 'getCollection(): ICollection',
            parameters: [],
            returns: 'ICollection'
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
            returns: 'IRequest'
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
            returns: 'IResponse'
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
            label:
              'queryDocuments(collectionLink: string, query: string | SqlQuerySpec, options: FeedOptions, callback: (err: IError, docs: RetrievedDocument[], info: IFeedCallbackInfo) => void): void',
            parameters: [
              { name: 'collectionLink', type: 'string' },
              { name: 'query', type: 'string | SqlQuerySpec' },
              { name: 'options', type: 'FeedOptions', optional: true },
              {
                name: 'callback',
                type: '(err: IError, docs: RetrievedDocument[], info: IFeedCallbackInfo) => void'
              }
            ],
            returns: 'void'
          }
        ],
        examples: [
          '// Example: Query documents',
          'const context = getContext()',
          'const collection = context.getCollection()',
          'collection.queryDocuments(collection.getSelfLink(), \'SELECT * FROM c\', {}, callback)'
        ],
        related: ['createDocument', 'readDocument'],
        notes: ['Supports both SQL text and SqlQuerySpec.']
      },

      {
        label: 'createDocument',
        detail: 'Create a new document.',
        documentation: 'Creates a document in the collection.',
        signatures: [
          {
            label:
              'createDocument(collectionLink: string, body: any, options: RequestOptions, callback: (err: IError, doc: RetrievedDocument) => void): void',
            parameters: [
              { name: 'collectionLink', type: 'string' },
              { name: 'body', type: 'any' },
              { name: 'options', type: 'RequestOptions', optional: true },
              {
                name: 'callback',
                type: '(err: IError, doc: RetrievedDocument) => void'
              }
            ],
            returns: 'void'
          }
        ]
      },

      {
        label: 'readDocument',
        detail: 'Read a document.',
        documentation: 'Reads a document by link.',
        signatures: [
          {
            label:
              'readDocument(documentLink: string, options: RequestOptions, callback: (err: IError, doc: RetrievedDocument) => void): void',
            parameters: [
              { name: 'documentLink', type: 'string' },
              { name: 'options', type: 'RequestOptions', optional: true },
              {
                name: 'callback',
                type: '(err: IError, doc: RetrievedDocument) => void'
              }
            ],
            returns: 'void'
          }
        ]
      },

      {
        label: 'replaceDocument',
        detail: 'Replace an existing document.',
        documentation: 'Replaces a document by link.',
        signatures: [
          {
            label:
              'replaceDocument(documentLink: string, body: any, options: RequestOptions, callback: (err: IError, doc: RetrievedDocument) => void): void',
            parameters: [
              { name: 'documentLink', type: 'string' },
              { name: 'body', type: 'any' },
              { name: 'options', type: 'RequestOptions', optional: true },
              {
                name: 'callback',
                type: '(err: IError, doc: RetrievedDocument) => void'
              }
            ],
            returns: 'void'
          }
        ]
      },

      {
        label: 'deleteDocument',
        detail: 'Delete a document.',
        documentation: 'Deletes a document by link.',
        signatures: [
          {
            label:
              'deleteDocument(documentLink: string, options: RequestOptions, callback: (err: IError) => void): void',
            parameters: [
              { name: 'documentLink', type: 'string' },
              { name: 'options', type: 'RequestOptions', optional: true },
              { name: 'callback', type: '(err: IError) => void' }
            ],
            returns: 'void'
          }
        ]
      },

      {
        label: 'upsertDocument',
        detail: 'Create or update a document.',
        documentation: 'Upserts a document in the collection.',
        signatures: [
          {
            label:
              'upsertDocument(collectionLink: string, body: any, options: RequestOptions, callback: (err: IError, doc: RetrievedDocument) => void): void',
            parameters: [
              { name: 'collectionLink', type: 'string' },
              { name: 'body', type: 'any' },
              { name: 'options', type: 'RequestOptions', optional: true },
              {
                name: 'callback',
                type: '(err: IError, doc: RetrievedDocument) => void'
              }
            ],
            returns: 'void'
          }
        ]
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
          { label: 'getBody(): any', parameters: [], returns: 'any' }
        ]
      },
      {
        label: 'setBody',
        detail: 'Set the request body.',
        documentation: 'Sets the body of the incoming request.',
        signatures: [
          {
            label: 'setBody(body: any): void',
            parameters: [{ name: 'body', type: 'any' }],
            returns: 'void'
          }
        ]
      },
      {
        label: 'getValue',
        detail: 'Get the request value.',
        documentation: 'Returns the value of the incoming request.',
        signatures: [
          {
            label: 'getValue(): any',
            parameters: [],
            returns: 'any'
          }
        ]
      },
      {
        label: 'setValue',
        detail: 'Set the request value.',
        documentation: 'Sets the value of the incoming request.',
        signatures: [
          {
            label: 'setValue(value: any): void',
            parameters: [{ name: 'value', type: 'any' }],
            returns: 'void'
          }
        ]
      }
    ]
  },

  response: {
    label: 'IResponse',
    functions: [
      {
        label: 'setStatusCode',
        detail: 'Set the response status code.',
        documentation: 'Sets the outgoing response status code.',
        signatures: [
          {
            label: 'setStatusCode(code: number): void',
            parameters: [{ name: 'code', type: 'number' }],
            returns: 'void'
          }
        ]
      },
      {
        label: 'setBody',
        detail: 'Set the response body.',
        documentation: 'Sets the outgoing response body.',
        signatures: [
          {
            label: 'setBody(body: any): void',
            parameters: [{ name: 'body', type: 'any' }],
            returns: 'void'
          }
        ]
      },
      {
        label: 'getBody',
        detail: 'Get the response body.',
        documentation: 'Returns the outgoing response body.',
        signatures: [
          {
            label: 'getBody(): any',
            parameters: [],
            returns: 'any'
          }
        ]
      }
    ]
  }
}
