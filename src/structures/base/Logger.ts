import pino, { type Logger, type LoggerOptions } from 'pino'

export const logger = (
  options?: LoggerOptions & { prettyPrint: boolean }
): Logger => {
  try {
    require.resolve('pino-pretty')
  } catch (error) {
    options!.prettyPrint = false
  }

  return pino({
    name: options?.name ?? 'Nocronok',
    level: options?.level ?? 'debug',
    timestamp: () =>
      `,"time":"${new Date().toLocaleTimeString('en-US', {
        hour12: false
      })}"`,
    messageKey: 'message',
    nestedKey: 'payload',
    ...(options?.prettyPrint && { transport: { target: 'pino-pretty' } })
  })
}
