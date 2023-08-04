import { readdir, stat } from 'fs/promises'
import { resolve, sep } from 'path'

import { IRequireDirectoryOptions } from '@interfaces'

export default class File {
  public static async requireDirectory (
    directory: string,
    success: (required, filename: string, parent: string) => void,
    error: (error) => void,
    options: IRequireDirectoryOptions = {
      extensions: ['js', 'ts'],
      recursive: true
    }
  ) {
    const files = await readdir(directory)
    const filesObject = {}

    return Promise.all(
      files.map(async (file) => {
        const path = resolve(directory, file)
        const extensions =
          Array.isArray(options.extensions) && options.extensions.length
            ? options.extensions.join('|')
            : options.extensions

        if (file.match(new RegExp(`\\.(${extensions})$`))) {
          try {
            const { default: required } = await import(path)
            const filename = file.match(/^\w+/)![0]
            const parent = path.split(sep).reverse()[1]

            if (success) {
              await success(required, filename, parent)
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
            return File.requireDirectory(path, success, error, options)
          }
        }
      })
    ).then(() => filesObject)
  }
}
