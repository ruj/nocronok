export interface IRequireDirectoryOptions {
  extensions: string | string[]
  recursive: boolean
}

export interface IFileObject {
  required: unknown
  filename: string
  parent: string
}
