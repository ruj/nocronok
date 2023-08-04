export interface IRouteEndpoint {
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
  path: string
  handler: string
}

export interface IRouteOptions {
  name: string
  endpoints: IRouteEndpoint[]
}
