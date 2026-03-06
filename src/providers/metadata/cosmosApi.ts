// src/providers/metadata/cosmosApi.ts

export interface ApiParameter {
  name: string;
  type: string;
  optional?: boolean;
  documentation?: string;
}

export interface ApiSignature {
  parameters: ApiParameter[];
  returns: string;
  documentation?: string;
}

export interface ApiFunction {
  label: string;
  detail: string;
  documentation: string;
  signatures: ApiSignature[];
}

export interface ApiGroup {
  label: string;
  functions: ApiFunction[];
}

export interface CosmosApiMetadata {
  context: ApiGroup;
  collection: ApiGroup;
  request: ApiGroup;
  response: ApiGroup;
}

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
            parameters: [],
            returns: 'IContext',
          },
        ],
      },
      {
        label: 'getCollection',
        detail: 'Returns the collection object.',
        documentation: 'Provides access to CRUD and query operations.',
        signatures: [
          {
            parameters: [],
            returns: 'ICollection',
          },
        ],
      },
      {
        label: 'getRequest',
        detail: 'Returns the request object.',
        documentation: 'Provides access to the incoming request.',
        signatures: [
          {
            parameters: [],
            returns: 'IRequest',
          },
        ],
      },
      {
        label: 'getResponse',
        detail: 'Returns the response object.',
        documentation: 'Used to set the response body and status code.',
        signatures: [
          {
            parameters: [],
            returns: 'IResponse',
          },
        ],
      },
    ],
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
            parameters: [
              { name: 'link', type: 'string' },
              { name: 'filterQuery', type: 'any' },
              { name: 'options', type: 'any', optional: true },
              {
                name: 'callback',
                type: '(err: IError, resources: any[], options: IRequestOptions) => void',
                optional: true,
              },
            ],
            returns: 'void',
          },
        ],
      },
      {
        label: 'readDocument',
        detail: 'Read a document by ID.',
        documentation: 'Reads a single document by its self-link.',
        signatures: [
          {
            parameters: [
              { name: 'link', type: 'string' },
              { name: 'options', type: 'any', optional: true },
              {
                name: 'callback',
                type: '(err: IError, resource: any, options: IRequestOptions) => void',
                optional: true,
              },
            ],
            returns: 'void',
          },
        ],
      },
      {
        label: 'createDocument',
        detail: 'Create a new document.',
        documentation: 'Inserts a new document into the collection.',
        signatures: [
          {
            parameters: [
              { name: 'link', type: 'string' },
              { name: 'body', type: 'any' },
              { name: 'options', type: 'any', optional: true },
              {
                name: 'callback',
                type: '(err: IError, resource: any, options: IRequestOptions) => void',
                optional: true,
              },
            ],
            returns: 'void',
          },
        ],
      },
      {
        label: 'replaceDocument',
        detail: 'Replace an existing document.',
        documentation: 'Replaces a document with new content.',
        signatures: [
          {
            parameters: [
              { name: 'link', type: 'string' },
              { name: 'body', type: 'any' },
              { name: 'options', type: 'any', optional: true },
              {
                name: 'callback',
                type: '(err: IError, resource: any, options: IRequestOptions) => void',
                optional: true,
              },
            ],
            returns: 'void',
          },
        ],
      },
      {
        label: 'deleteDocument',
        detail: 'Delete a document.',
        documentation: 'Deletes a document by its self-link.',
        signatures: [
          {
            parameters: [
              { name: 'link', type: 'string' },
              { name: 'options', type: 'any', optional: true },
              {
                name: 'callback',
                type: '(err: IError, resource: any, options: IRequestOptions) => void',
                optional: true,
              },
            ],
            returns: 'void',
          },
        ],
      },
      {
        label: 'upsertDocument',
        detail: 'Insert or update a document.',
        documentation: 'Creates or replaces a document depending on existence.',
        signatures: [
          {
            parameters: [
              { name: 'link', type: 'string' },
              { name: 'body', type: 'any' },
              { name: 'options', type: 'any', optional: true },
              {
                name: 'callback',
                type: '(err: IError, resource: any, options: IRequestOptions) => void',
                optional: true,
              },
            ],
            returns: 'void',
          },
        ],
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
        signatures: [
          {
            parameters: [],
            returns: 'any',
          },
        ],
      },
      {
        label: 'setBody',
        detail: 'Set the request body.',
        documentation: 'Sets the body of the incoming request.',
        signatures: [
          {
            parameters: [{ name: 'body', type: 'any' }],
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
            parameters: [{ name: 'value', type: 'any' }],
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
        label: 'setBody',
        detail: 'Set the response body.',
        documentation: 'Sets the body of the response returned to the client.',
        signatures: [
          {
            parameters: [{ name: 'body', type: 'any' }],
            returns: 'void',
          },
        ],
      },
      {
        label: 'getBody',
        detail: 'Get the response body.',
        documentation: 'Returns the current response body.',
        signatures: [
          {
            parameters: [],
            returns: 'any',
          },
        ],
      },
      {
        label: 'setStatusCode',
        detail: 'Set the HTTP status code.',
        documentation: 'Sets the status code for the response.',
        signatures: [
          {
            parameters: [{ name: 'code', type: 'number' }],
            returns: 'void',
          },
        ],
      },
      {
        label: 'getStatusCode',
        detail: 'Get the HTTP status code.',
        documentation: 'Returns the current status code.',
        signatures: [
          {
            parameters: [],
            returns: 'number',
          },
        ],
      },
    ],
  },
}
