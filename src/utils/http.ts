import fetch from 'cross-fetch'
import merge from 'lodash/merge'

type Payload = {
  [key: string]: any
}

type Headers = Payload

const defaultHeaders = {
  'Content-Type': 'application/json'
}

const response = async <Type>(response: Response): Promise<Type> => {
  const contentType = response.headers.get('Content-Type')

  if (contentType && contentType.startsWith('application/json')) {
    return response.json()
  } else {
    return response.text() as unknown as Type
  }
}

export const GET = async <Type>(
  path: string,
  headers: Headers = defaultHeaders
): Promise<Type> => {
  return response<Type>(
    await fetch(path, { headers: merge(defaultHeaders, headers) })
  )
}
