import fetch from 'cross-fetch'
import merge from 'lodash/merge'

type Payload = {
  [key: string]: any
}

type Headers = Payload

const defaultHeaders = {
  'Content-Type': 'application/json'
}

const response = <T>(response: any): Promise<T> =>
  response.headers.get('Content-Type').startsWith('application/json')
    ? (response.json() as Promise<{ data: T }>)
    : response.text()

export const GET = (path: string, headers: Headers = defaultHeaders) =>
  fetch(path, { headers: merge(defaultHeaders, headers) }).then(response)
