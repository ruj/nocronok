import { ELoader } from '@enums'
import EnumUtils from '@utils/EnumUtils'
import Mapper from '@utils/Mapper'

import ApiLoader from './ApiLoader'
import CommandLoader from './CommandLoader'
import HttpLoader from './HttpLoader'
import ListenerLoader from './ListenerLoader'
import LocaleLoader from './LocaleLoader'

export type Loader = ReturnType<typeof EnumUtils.convertCase>

export type LoaderType =
  | typeof ApiLoader
  | typeof CommandLoader
  | typeof HttpLoader
  | typeof ListenerLoader
  | typeof LocaleLoader

export const loader: Loader = EnumUtils.convertCase(
  ELoader,
  EnumUtils.toPascal.bind(EnumUtils)
)

const loaders: Mapper<keyof Loader, LoaderType> = new Mapper<
  keyof Loader,
  LoaderType
>([
  [loader.API_LOADER, ApiLoader],
  [loader.COMMAND_LOADER, CommandLoader],
  [loader.HTTP_LOADER, HttpLoader],
  [loader.LISTENER_LOADER, ListenerLoader],
  [loader.LOCALE_LOADER, LocaleLoader]
])

export default loaders
