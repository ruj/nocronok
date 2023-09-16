import { EEnvironmentVariables } from '@enums'

export const EnvVars = Object.keys(EEnvironmentVariables)

export const Errors = {
  Command: {
    Requirements: {
      DEVELOPERS_ONLY: 'Only the bot developers can to that'
    }
  },
  Loaders: {
    HttpLoader: {
      PORT_IS_NOT_SET:
        'Server not started - Environment variable "PORT" is not set',
      HTTP_PASSWORD_IS_NOT_SET:
        'Unprotected requests - Environment variable "HTTP_PASSWORD" is not set'
    }
  }
}
