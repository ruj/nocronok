import pick from 'lodash/pick'

import { IDefaultOptions } from '@interfaces'

export default class Options extends null {
  public static defaultOptions (): IDefaultOptions {
    return {
      env: pick(process.env, ['PORT', 'HTTP_PASSWORD'])
    }
  }
}
