// src/providers/metadata/cosmosApi.ts

import {
  // ApiParameter,
  // ApiSignature,
  // ApiFunction,
  // ApiGroup,
  CosmosApiMetadata
} from './metadataSchema'

export const cosmosApi: CosmosApiMetadata = {
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
        examples: [
          '// Example: const ctx = getContext()'
        ],
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
            returns: 'ICollection',
            documentation: 'Retrieves the collection interface for document operations.'
          }
        ],
        examples: [
          '// Example: const col = getContext().getCollection()'
        ],
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
        examples: [
          '// Example: const req = getContext().getRequest()'
        ],
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
        examples: [
          '// Example: const res = getContext().getResponse()'
        ],
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
            label: 'queryDocuments(link: string, filterQuery: any, options?: any, callback?: (err: IError, resources: any[], options: IRequestOptions) => void): void',
            parameters: [
              { name: 'link', type: 'string', documentation: 'Self-link of the collection.' },
              { name: 'filterQuery', type: 'any', documentation: 'SQL query or query spec.' },
              { name: 'options', type: 'any', optional: true, documentation: 'Optional request options.' },
              { name: 'callback', type: '(err: IError, resources: any[], options: IRequestOptions) => void', optional: true, documentation: 'Callback for async execution.' }
            ],
            returns: 'void',
            documentation: 'Queries documents using a SQL-like syntax.'
          }
        ],
        examples: [
          '// Example: col.queryDocuments(colLink, "SELECT * FROM c")'
        ],
        related: ['readDocument', 'createDocument'],
        notes: ['Supports both callback and continuation token patterns.']
      },
      {
        label: 'readDocument',
        detail: 'Read a document by ID.',
        documentation: 'Reads a single document by its self-link.',
        signatures: [
          {
            label: 'readDocument(link: string, options?: any, callback?: (err: IError, resource: any, options: IRequestOptions) => void): void',
            parameters: [
              { name: 'link', type: 'string', documentation: 'Self-link of the document.' },
              { name: 'options', type: 'any', optional: true, documentation: 'Optional request options.' },
              { name: 'callback', type: '(err: IError, resource: any, options: IRequestOptions) => void', optional: true, documentation: 'Callback for async execution.' }
            ],
            returns: 'void',
            documentation: 'Reads a document from the collection.'
          }
        ],
        examples: [
          '// Example: col.readDocument(docLink)'
        ],
        related: ['queryDocuments', 'replaceDocument'],
        notes: ['Throws if the document does not exist.']
      },
      {
        label: 'createDocument',
        detail: 'Create a new document.',
        documentation: 'Inserts a new document into the collection.',
        signatures: [
          {
            label: 'createDocument(link: string, body: any, options?: any, callback?: (err: IError, resource: any, options: IRequestOptions) => void): void',
            parameters: [
              { name: 'link', type: 'string', documentation: 'Self-link of the collection.' },
              { name: 'body', type: 'any', documentation: 'Document body to insert.' },
              { name: 'options', type: 'any', optional: true, documentation: 'Optional request options.' },
              { name: 'callback', type: '(err: IError, resource: any, options: IRequestOptions) => void', optional: true, documentation: 'Callback for async execution.' }
            ],
            returns: 'void',
            documentation: 'Creates a new document in the collection.'
          }
        ],
        examples: [
          '// Example: col.createDocument(colLink, { id: "1" })'
        ],
        related: ['upsertDocument', 'replaceDocument'],
        notes: ['Fails if a document with the same ID already exists.']
      },
      {
        label: 'replaceDocument',
        detail: 'Replace an existing document.',
        documentation: 'Replaces a document with new content.',
        signatures: [
          {
            label: 'replaceDocument(link: string, body: any, options?: any, callback?: (err: IError, resource: any, options: IRequestOptions) => void): void',
            parameters: [
              { name: 'link', type: 'string', documentation: 'Self-link of the document.' },
              { name: 'body', type: 'any', documentation: 'New document body.' },
              { name: 'options', type: 'any', optional: true, documentation: 'Optional request options.' },
              { name: 'callback', type: '(err: IError, resource: any, options: IRequestOptions) => void', optional: true, documentation: 'Callback for async execution.' }
            ],
            returns: 'void',
            documentation: 'Replaces an existing document.'
          }
        ],
        examples: [
          '// Example: col.replaceDocument(docLink, updatedDoc)'
        ],
        related: ['createDocument', 'upsertDocument'],
        notes: ['Document must already exist.']
      },
      {
        label: 'deleteDocument',
        detail: 'Delete a document.',
        documentation: 'Deletes a document by its self-link.',
        signatures: [
          {
            label: 'deleteDocument(link: string, options?: any, callback?: (err: IError, resource: any, options: IRequestOptions) => void): void',
            parameters: [
              { name: 'link', type: 'string', documentation: 'Self-link of the document.' },
              { name: 'options', type: 'any', optional: true, documentation: 'Optional request options.' },
              { name: 'callback', type: '(err: IError, resource: any, options: IRequestOptions) => void', optional: true, documentation: 'Callback for async execution.' }
            ],
            returns: 'void',
            documentation: 'Deletes a document from the collection.'
          }
        ],
        examples: [
          '// Example: col.deleteDocument(docLink)'
        ],
        related: ['readDocument', 'replaceDocument'],
        notes: ['Operation is irreversible.']
      },
      {
        label: 'upsertDocument',
        detail: 'Insert or update a document.',
        documentation: 'Creates or replaces a document depending on existence.',
        signatures: [
          {
            label: 'upsertDocument(link: string, body: any, options?: any, callback?: (err: IError, resource: any, options: IRequestOptions) => void): void',
            parameters: [
              { name: 'link', type: 'string', documentation: 'Self-link of the collection.' },
              { name: 'body', type: 'any', documentation: 'Document body to insert or update.' },
              { name: 'options', type: 'any', optional: true, documentation: 'Optional request options.' },
              { name: 'callback', type: '(err: IError, resource: any, options: IRequestOptions) => void', optional: true, documentation: 'Callback for async execution.' }
            ],
            returns: 'void',
            documentation: 'Creates or updates a document.'
          }
        ],
        examples: [
          '// Example: col.upsertDocument(colLink, { id: "1" })'
        ],
        related: ['createDocument', 'replaceDocument'],
        notes: ['Upsert avoids conflicts when the document may or may not exist.']
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
            returns: 'any',
            documentation: 'Retrieves the body of the incoming request.'
          }
        ],
        examples: [
          '// Example: const body = getContext().getRequest().getBody()'
        ],
        related: ['setBody', 'getValue'],
        notes: ['Useful for reading input passed to the script.']
      },
      {
        label: 'setBody',
        detail: 'Set the request body.',
        documentation: 'Sets the body of the incoming request.',
        signatures: [
          {
            label: 'setBody(body: any): void',
            parameters: [
              { name: 'body', type: 'any', documentation: 'The new request body.' }
            ],
            returns: 'void',
            documentation: 'Sets the body of the incoming request.'
          }
        ],
        examples: [
          '// Example: getContext().getRequest().setBody({ x: 1 })'
        ],
        related: ['getBody', 'setValue'],
        notes: ['Overwrites any existing request body.']
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
            documentation: 'Retrieves the value associated with the incoming request.'
          }
        ],
        examples: [
          '// Example: const v = getContext().getRequest().getValue()'
        ],
        related: ['setValue', 'getBody'],
        notes: ['Represents a single value rather than a full body.']
      },
      {
        label: 'setValue',
        detail: 'Set the request value.',
        documentation: 'Sets the value of the incoming request.',
        signatures: [
          {
            label: 'setValue(value: any): void',
            parameters: [
              { name: 'value', type: 'any', documentation: 'The new request value.' }
            ],
            returns: 'void',
            documentation: 'Sets the value associated with the incoming request.'
          }
        ],
        examples: [
          '// Example: getContext().getRequest().setValue(42)'
        ],
        related: ['getValue', 'setBody'],
        notes: ['Overwrites any existing request value.']
      }
    ]
  },
  response: {
    label: 'IResponse',
    functions: [
      {
        label: 'setBody',
        detail: 'Set the response body.',
        documentation: 'Sets the body of the response returned to the client.',
        signatures: [
          {
            label: 'setBody(body: any): void',
            parameters: [
              { name: 'body', type: 'any', documentation: 'The new response body.' }
            ],
            returns: 'void',
            documentation: 'Sets the outgoing response body.'
          }
        ],
        examples: [
          '// Example: getContext().getResponse().setBody({ ok: true })'
        ],
        related: ['getBody', 'setStatusCode'],
        notes: ['This determines what the client receives.']
      },
      {
        label: 'getBody',
        detail: 'Get the response body.',
        documentation: 'Returns the current response body.',
        signatures: [
          {
            label: 'getBody(): any',
            parameters: [],
            returns: 'any',
            documentation: 'Retrieves the outgoing response body.'
          }
        ],
        examples: [
          '// Example: const body = getContext().getResponse().getBody()'
        ],
        related: ['setBody', 'getStatusCode'],
        notes: ['Useful for debugging or modifying the response.']
      },
      {
        label: 'setStatusCode',
        detail: 'Set the HTTP status code.',
        documentation: 'Sets the status code for the response.',
        signatures: [
          {
            label: 'setStatusCode(code: number): void',
            parameters: [
              { name: 'code', type: 'number', documentation: 'The HTTP status code to set.' }
            ],
            returns: 'void',
            documentation: 'Sets the HTTP status code for the outgoing response.'
          }
        ],
        examples: [
          '// Example: getContext().getResponse().setStatusCode(200)'
        ],
        related: ['getStatusCode', 'setBody'],
        notes: ['Common values: 200, 400, 404, 500.']
      },
      {
        label: 'getStatusCode',
        detail: 'Get the HTTP status code.',
        documentation: 'Returns the current status code.',
        signatures: [
          {
            label: 'getStatusCode(): number',
            parameters: [],
            returns: 'number',
            documentation: 'Retrieves the HTTP status code for the outgoing response.'
          }
        ],
        examples: [
          '// Example: const code = getContext().getResponse().getStatusCode()'
        ],
        related: ['setStatusCode', 'getBody'],
        notes: ['Defaults to 200 unless changed.']
      }
    ]
  }
}
