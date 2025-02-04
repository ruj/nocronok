import { readdir, stat } from 'node:fs/promises'
import { resolve, sep } from 'node:path'

import { type IFileObject, type IRequireDirectoryOptions } from '@interfaces'

export default class File {
  public static async requireDirectory (
    directory: string,
    success: (required: any, filename: string, parent: string) => void,
    error: (error: unknown) => void,
    options: IRequireDirectoryOptions = {
      extensions: ['js', 'ts'],
      recursive: true
    }
  ): Promise<Record<string, IFileObject>> {
    const files = await readdir(directory)
    const filesObject: Record<string, IFileObject> = {}

    return await Promise.all(
      files.map(async (file) => {
        const path = resolve(directory, file)
        const extensions = Array.isArray(options.extensions)
          ? options.extensions.join('|')
          : options.extensions

        if (file.match(new RegExp(`\\.(${extensions})$`))) {
          try {
            const { default: required } = await import(path)
            const filename = file.replace(/\.[^/.]+$/, '')
            const parent = path.split(sep).reverse()[1]

            if (success) {
              await Promise.resolve(success(required, filename, parent))
            }

            filesObject[filename] = {
              required,
              filename,
              parent
            }

            return required
          } catch (_error) {
            error(_error)
          }
        } else if (options.recursive) {
          const isDirectory = await stat(path).then((file) =>
            file.isDirectory()
          )

          if (isDirectory) {
            return await File.requireDirectory(path, success, error, options)
          }
        }
      })
    ).then(() => filesObject)
  }
}
