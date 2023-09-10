import pick from 'lodash/pick'

import { IDefaultOptions } from '@interfaces'

import { EnvVars } from './Constants'

export default class Options extends null {
  public static defaultOptions (): IDefaultOptions {
    return {
      env: Options.sanitizedEnvs()
    }
  }

  private static sanitizedEnvs (envVars: string[] = EnvVars) {
    const envs = {} as IDefaultOptions['env']

    for (const [key, value] of Object.entries(pick(process.env, envVars))) {
      if (key) {
        envs[key as keyof typeof envs] = value && JSON.parse(value)
      }
    }

    return envs
  }
}
