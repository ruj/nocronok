import Polyglot, { PolyglotOptions } from 'node-polyglot'

export default class extends Polyglot {
  constructor (options?: PolyglotOptions) {
    super(options)
  }

  public yn (condition: boolean) {
    return super.t(condition ? 'commons.yes' : 'commons.no')
  }
}
