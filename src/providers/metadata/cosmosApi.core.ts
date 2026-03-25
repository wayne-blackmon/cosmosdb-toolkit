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
            returns: 'IContext',
          },
        ],
        examples: ['// Example: const ctx = getContext()'],
        related: ['getCollection', 'getRequest', 'getResponse'],
        notes: ['This is typically the first call in a server-side script.'],
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
          },
        ],
        examples: ['// Example: const col = getContext().getCollection()'],
        related: ['queryDocuments', 'createDocument', 'readDocument'],
        notes: ['Used for all document-level operations.'],
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
          },
        ],
        examples: ['// Example: const req = getContext().getRequest()'],
        related: ['getBody', 'getValue'],
        notes: ['Useful for reading input passed to the script.'],
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
          },
        ],
        examples: ['// Example: const res = getContext().getResponse()'],
        related: ['setBody', 'setStatusCode'],
        notes: ['Used to control the output returned to the client.'],
      },
    ],
  },

  collection: {
    label: 'ICollection',
    functions: [
      {
        label: 'getSelfLink',
        detail: 'Get the self-link for the current collection.',
        documentation: 'Returns the collection self-link that can be used in collection API calls.',
        signatures: [
          {
            label: 'getSelfLink(): string',
            parameters: [],
            returns: 'string',
          },
        ],
        examples: [
          '// Example: use self-link in a query',
          'const context = getContext()',
          'const collection = context.getCollection()',
          'const link = collection.getSelfLink()',
        ],
        related: ['queryDocuments', 'createDocument', 'upsertDocument'],
        notes: ['Typically passed as the first argument to collection operations.'],
        snippet: {
          js: {
            prefix: 'getSelfLink',
            description: 'Get the collection self-link.',
            body: ['const ${1:link} = ${2:collection}.getSelfLink()'],
          },
          ts: {
            prefix: 'getSelfLink',
            description: 'Get the collection self-link.',
            body: ['const ${1:link} = ${2:collection}.getSelfLink()'],
          },
        },
      },
      {
        label: 'queryDocuments',
        detail: 'Query documents in the collection.',
        documentation: 'Executes a SQL query against the collection.',
        signatures: [
          {
            label:
              'queryDocuments(collectionLink: string, query: string | SqlQuerySpec, options: FeedOptions, callback: (err: IError, docs: RetrievedDocument[], info: IFeedCallbackInfo) => void): void',
            parameters: [
              {
                name: 'collectionLink',
                type: 'string',
                documentation: 'Self-link of the collection to query, typically from collection.getSelfLink().',
              },
              {
                name: 'query',
                type: 'string | SqlQuerySpec',
                documentation: 'SQL text or SqlQuerySpec object describing the query to run.',
              },
              {
                name: 'options',
                type: 'FeedOptions',
                optional: true,
                documentation: 'Optional query settings such as continuation token and page size.',
              },
              {
                name: 'callback',
                type: '(err: IError, docs: RetrievedDocument[], info: IFeedCallbackInfo) => void',
                documentation: 'Invoked with an error, the result documents, and response metadata.',
              },
            ],
            returns: 'void',
          },
        ],
        examples: [
          '// Example: Query documents',
          'const context = getContext()',
          'const collection = context.getCollection()',
          'collection.queryDocuments(collection.getSelfLink(), \'SELECT * FROM c\', {}, callback)',
        ],
        related: ['getSelfLink', 'createDocument', 'readDocument'],
        notes: ['Supports both SQL text and SqlQuerySpec.'],
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
              {
                name: 'collectionLink',
                type: 'string',
                documentation: 'Self-link of the collection where the document will be created.',
              },
              {
                name: 'body',
                type: 'any',
                documentation: 'Document object to insert.',
              },
              {
                name: 'options',
                type: 'RequestOptions',
                optional: true,
                documentation: 'Optional write options such as indexing directives.',
              },
              {
                name: 'callback',
                type: '(err: IError, doc: RetrievedDocument) => void',
                documentation: 'Invoked when the create operation completes.',
              },
            ],
            returns: 'void',
          },
        ],
        examples: [
          '// Example: create a document',
          'collection.createDocument(collection.getSelfLink(), { id: "1" }, {}, callback)',
        ],
        related: ['getSelfLink', 'upsertDocument', 'replaceDocument'],
        notes: ['Throws when the operation is not accepted by the server runtime.'],
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
              {
                name: 'documentLink',
                type: 'string',
                documentation: 'Self-link of the document to read.',
              },
              {
                name: 'options',
                type: 'RequestOptions',
                optional: true,
                documentation: 'Optional read options.',
              },
              {
                name: 'callback',
                type: '(err: IError, doc: RetrievedDocument) => void',
                documentation: 'Invoked with the retrieved document.',
              },
            ],
            returns: 'void',
          },
        ],
        examples: ['// Example: collection.readDocument(docLink, {}, callback)'],
        related: ['queryDocuments', 'replaceDocument', 'deleteDocument'],
        notes: ['Use when you already have a document self-link.'],
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
              {
                name: 'documentLink',
                type: 'string',
                documentation: 'Self-link of the document to replace.',
              },
              {
                name: 'body',
                type: 'any',
                documentation: 'Updated document content.',
              },
              {
                name: 'options',
                type: 'RequestOptions',
                optional: true,
                documentation: 'Optional replace options.',
              },
              {
                name: 'callback',
                type: '(err: IError, doc: RetrievedDocument) => void',
                documentation: 'Invoked with the updated document.',
              },
            ],
            returns: 'void',
          },
        ],
        examples: ['// Example: collection.replaceDocument(docLink, updatedDoc, {}, callback)'],
        related: ['readDocument', 'upsertDocument', 'createDocument'],
        notes: ['Replaces the entire document payload.'],
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
              {
                name: 'documentLink',
                type: 'string',
                documentation: 'Self-link of the document to delete.',
              },
              {
                name: 'options',
                type: 'RequestOptions',
                optional: true,
                documentation: 'Optional delete options.',
              },
              {
                name: 'callback',
                type: '(err: IError) => void',
                documentation: 'Invoked when deletion completes or fails.',
              },
            ],
            returns: 'void',
          },
        ],
        examples: ['// Example: collection.deleteDocument(docLink, {}, callback)'],
        related: ['readDocument', 'queryDocuments'],
        notes: ['Deletes exactly one document by self-link.'],
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
              {
                name: 'collectionLink',
                type: 'string',
                documentation: 'Self-link of the target collection.',
              },
              {
                name: 'body',
                type: 'any',
                documentation: 'Document object to create or update.',
              },
              {
                name: 'options',
                type: 'RequestOptions',
                optional: true,
                documentation: 'Optional upsert options.',
              },
              {
                name: 'callback',
                type: '(err: IError, doc: RetrievedDocument) => void',
                documentation: 'Invoked with the stored document after upsert.',
              },
            ],
            returns: 'void',
          },
        ],
        examples: ['// Example: collection.upsertDocument(collection.getSelfLink(), doc, {}, callback)'],
        related: ['getSelfLink', 'createDocument', 'replaceDocument'],
        notes: ['Creates a new document when it does not exist; otherwise updates it.'],
      },
    ],
  },

  request: {
    label: 'IRequest',
    functions: [
      {
        label: 'getBody',
        detail: 'Get the request body.',
        documentation: 'Returns the body of the incoming request.',
        signatures: [{ label: 'getBody(): any', parameters: [], returns: 'any' }],
      },
      {
        label: 'setBody',
        detail: 'Set the request body.',
        documentation: 'Sets the body of the incoming request.',
        signatures: [
          {
            label: 'setBody(body: any): void',
            parameters: [
              {
                name: 'body',
                type: 'any',
                documentation: 'The value to assign as the request body.',
              },
            ],
            returns: 'void',
          },
        ],
      },
      {
        label: 'getValue',
        detail: 'Get the request value.',
        documentation: 'Returns the value of the incoming request.',
        signatures: [
          {
            label: 'getValue(): any',
            parameters: [],
            returns: 'any',
          },
        ],
      },
      {
        label: 'setValue',
        detail: 'Set the request value.',
        documentation: 'Sets the value of the incoming request.',
        signatures: [
          {
            label: 'setValue(value: any): void',
            parameters: [
              {
                name: 'value',
                type: 'any',
                documentation: 'The value to assign for the request payload.',
              },
            ],
            returns: 'void',
          },
        ],
      },
    ],
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
            parameters: [
              {
                name: 'code',
                type: 'number',
                documentation: 'HTTP status code to return to the caller.',
              },
            ],
            returns: 'void',
          },
        ],
      },
      {
        label: 'setBody',
        detail: 'Set the response body.',
        documentation: 'Sets the outgoing response body.',
        signatures: [
          {
            label: 'setBody(body: any): void',
            parameters: [
              {
                name: 'body',
                type: 'any',
                documentation: 'Value to return as the response body.',
              },
            ],
            returns: 'void',
          },
        ],
      },
      {
        label: 'getBody',
        detail: 'Get the response body.',
        documentation: 'Returns the outgoing response body.',
        signatures: [
          {
            label: 'getBody(): any',
            parameters: [],
            returns: 'any',
          },
        ],
      },
    ],
  },
}
