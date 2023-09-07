/* global NodeJS */

export interface IDefaultOptions {
  env: Pick<NodeJS.ProcessEnv, 'PORT' | 'HTTP_PASSWORD'>
}
