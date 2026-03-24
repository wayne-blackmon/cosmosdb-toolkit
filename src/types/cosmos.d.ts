// src/types/cosmos.d.ts

declare function getContext(): IContext

declare interface IContext {
  getCollection(): ICollection
  getRequest(): IRequest
  getResponse(): IResponse
}

declare interface ICollection {
  queryDocuments(
    link: string,
    filter: any,
    options: IRequestOptions,
    callback?: (
      err: IError,
      resources: any,
      info: IFeedCallbackInfo
    ) => void
  ): boolean

  createDocument(
    link: string,
    body: any,
    options?: IRequestOptions,
    callback?: (
      err: IError,
      resource: any,
      info: IFeedCallbackInfo
    ) => void
  ): boolean

  readDocument(
    link: string,
    options?: IRequestOptions,
    callback?: (
      err: IError,
      resource: any,
      info: IFeedCallbackInfo
    ) => void
  ): boolean

  replaceDocument(
    link: string,
    body: any,
    options?: IRequestOptions,
    callback?: (
      err: IError,
      resource: any,
      info: IFeedCallbackInfo
    ) => void
  ): boolean

  deleteDocument(
    link: string,
    options?: IRequestOptions,
    callback?: (
      err: IError,
      resource: any,
      info: IFeedCallbackInfo
    ) => void
  ): boolean

  upsertDocument(
    link: string,
    body: any,
    options?: IRequestOptions,
    callback?: (
      err: IError,
      resource: any,
      info: IFeedCallbackInfo
    ) => void
  ): boolean
}

declare interface IRequest {
  getBody(): any
  setBody(body: any): void
  getValue(): any
  setValue(value: any): void
}

declare interface IResponse {
  setStatusCode(code: number): void
  setBody(body: any): void
}

declare interface IRequestOptions {
  enableScanInQuery?: boolean
  maxItemCount?: number
  continuation?: string | null
}

declare interface IError {
  message: string
}

declare interface IFeedCallbackInfo {
  continuation?: string
}
