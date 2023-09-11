/* global NodeJS */

import { EEnvironmentVariables } from '@enums'

export interface IDefaultOptions {
  env: Pick<NodeJS.ProcessEnv, EEnvironmentVariables>
}
