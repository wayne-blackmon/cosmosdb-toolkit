// src/providers/metadata/cosmosApi.ts

export const cosmosApi = {
  context: {
    functions: [
      {
        label: 'getContext',
        detail: 'Returns the context object.',
        documentation: 'The entry point for all server-side operations.',
        signature: 'getContext(): IContext'
      },
      {
        label: 'getCollection',
        detail: 'Returns the collection object.',
        documentation: 'Provides access to CRUD and query operations.',
        signature: 'getCollection(): ICollection'
      },
      {
        label: 'getResponse',
        detail: 'Returns the response object.',
        documentation: 'Used to set the response body and status code.',
        signature: 'getResponse(): IResponse'
      }
    ]
  },

  collection: {
    functions: [
      {
        label: 'queryDocuments',
        detail: 'Query documents in the collection.',
        documentation: 'Executes a SQL query against the collection.',
        signature: 'queryDocuments(link: string, filterQuery: any, options?: any, callback?: Function): boolean'
      },
      {
        label: 'readDocument',
        detail: 'Read a document by ID.',
        documentation: 'Reads a single document by its self-link.',
        signature: 'readDocument(link: string, options?: any, callback?: Function): boolean'
      },
      {
        label: 'createDocument',
        detail: 'Create a new document.',
        documentation: 'Inserts a new document into the collection.',
        signature: 'createDocument(link: string, body: any, options?: any, callback?: Function): boolean'
      },
      {
        label: 'replaceDocument',
        detail: 'Replace an existing document.',
        documentation: 'Replaces a document with new content.',
        signature: 'replaceDocument(link: string, body: any, options?: any, callback?: Function): boolean'
      },
      {
        label: 'deleteDocument',
        detail: 'Delete a document.',
        documentation: 'Deletes a document by its self-link.',
        signature: 'deleteDocument(link: string, options?: any, callback?: Function): boolean'
      },
      {
        label: 'upsertDocument',
        detail: 'Insert or update a document.',
        documentation: 'Creates or replaces a document depending on existence.',
        signature: 'upsertDocument(link: string, body: any, options?: any, callback?: Function): boolean'
      }
    ]
  },

  response: {
    functions: [
      {
        label: 'setBody',
        detail: 'Set the response body.',
        documentation: 'Sets the body of the response returned to the client.',
        signature: 'setBody(body: any): void'
      },
      {
        label: 'getBody',
        detail: 'Get the response body.',
        documentation: 'Returns the current response body.',
        signature: 'getBody(): any'
      },
      {
        label: 'setStatusCode',
        detail: 'Set the HTTP status code.',
        documentation: 'Sets the status code for the response.',
        signature: 'setStatusCode(code: number): void'
      },
      {
        label: 'getStatusCode',
        detail: 'Get the HTTP status code.',
        documentation: 'Returns the current status code.',
        signature: 'getStatusCode(): number'
      }
    ]
  }
};
