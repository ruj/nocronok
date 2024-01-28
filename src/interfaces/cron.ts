import type { Logger } from 'pino'

import type Nocronok from '@structures/base/Nocronok'

export interface ICronOptions {
  cronTime: string
  onComplete?: any
  start?: boolean
  timeZone?: string
}

export interface ICronJobContext {
  client: Nocronok
  logger: Logger
}
