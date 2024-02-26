import type Nocronok from '@structures/base/Nocronok'
import Loader from '@structures/Loader'
import Polyglot from '@structures/Polyglot'

export default class LocaleLoader extends Loader {
  public locales: Record<string, any>

  constructor (client: Nocronok) {
    super(client)

    this.locales = {}
  }

  public async load (): Promise<boolean> {
    await this.loadFiles('locales', { extensions: 'json', recursive: true })
    await Promise.resolve(this.initializePolyglot())

    return true
  }

  public loadFile (data: any, filename: string, locale: string): void {
    if (!Object.prototype.hasOwnProperty.call(this.locales, locale)) {
      if (!Object.prototype.hasOwnProperty.call(this.locales, filename)) {
        this.locales[locale] = { [filename]: data }
      }
    } else {
      this.locales[locale] = Object.assign(this.locales[locale], {
        [filename]: data
      })
    }
  }

  private initializePolyglot (): void {
    const polyglots = new Map()

    for (const locale in this.locales) {
      const polyglot = new Polyglot()

      polyglot.extend(this.locales[locale])
      polyglots.set(locale, polyglot)
    }

    this.client.polyglots = polyglots
  }
}
