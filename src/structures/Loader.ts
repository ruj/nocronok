import { resolve } from 'path'
import type { Logger } from 'pino'

import { IRequireDirectoryOptions } from '@interfaces'
import File from '@utils/File'

import type Nocronok from './base/Nocronok'

export default abstract class Loader {
  public client: Nocronok
  public logger: Logger
  public abstract loadFile(file, filename: string): void

  constructor (client: Nocronok) {
    this.client = client
    this.logger = client.logger
  }

  public async loadFiles (path: string, options?: IRequireDirectoryOptions) {
    await File.requireDirectory(
      this.resolvePath(path),
      (file, filename) => this.loadFile(file, filename),
      console.error,
      options
    )
  }

  private resolvePath (path: string) {
    return resolve(__dirname, '..', path)
  }
}
