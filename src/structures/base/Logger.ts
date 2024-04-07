import pino, { type Logger, type LoggerOptions } from 'pino'
import { createWriteStream, Severity } from 'pino-sentry'

import { LoggerLevel } from '@enums'

export const logger = (
  options?: LoggerOptions & { prettyPrint?: boolean }
): Logger => {
  try {
    require.resolve('pino-pretty')
  } catch (error) {
    options!.prettyPrint = false
  }

  return pino(
    {
      name: options?.name ?? 'Nocronok',
      level: options?.level ?? LoggerLevel.DEBUG,
      timestamp: () =>
        `,"time":"${new Date().toLocaleTimeString('en-US', {
          hour12: false
        })}"`,
      messageKey: 'message',
      nestedKey: 'payload',
      ...(options?.prettyPrint && { transport: { target: 'pino-pretty' } })
    },
    createWriteStream({
      dsn: process.env.SENTRY_DSN,
      messageAttributeKey: 'message',
      stackAttributeKey: 'trace',
      extraAttributeKeys: ['payload'],
      sentryExceptionLevels: [Severity.Warning, Severity.Error, Severity.Fatal],
      beforeBreadcrumb: (breadcrumb) => {
        if (
          (breadcrumb.level === Severity.Info ||
            breadcrumb.level === Severity.Debug) &&
          breadcrumb.category === 'console'
        ) {
          return null
        }

        return breadcrumb
      }
    })
  )
}
