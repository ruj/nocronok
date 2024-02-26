/* global NodeJS */

import { type EEnvironmentVariables } from '@enums'

export interface IDefaultOptions {
  env: Pick<NodeJS.ProcessEnv, EEnvironmentVariables>
}
