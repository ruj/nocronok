import pick from 'lodash/pick'

import { type EEnvironmentVariables } from '@enums'
import { type IDefaultOptions } from '@interfaces'

import { EnvVars } from './Constants'

export default class Options extends null {
  public static defaultOptions (): IDefaultOptions {
    return {
      env: Options.sanitizedEnvironmentVariables()
    }
  }

  private static sanitizedEnvironmentVariables (
    envVars: string[] = EnvVars
  ): IDefaultOptions['env'] {
    const envs: Partial<IDefaultOptions['env']> = {}

    for (const [key, value] of Object.entries(pick(process.env, envVars))) {
      if (key) {
        envs[key as EEnvironmentVariables] = value && JSON.parse(value)
      }
    }

    return envs as IDefaultOptions['env']
  }
}
