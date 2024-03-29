import { EEnvironmentVariables } from '@enums'

export const EnvVars = Object.keys(EEnvironmentVariables)

export const Errors = {
  Loaders: {
    HttpLoader: {
      PORT_IS_NOT_SET:
        'Server not started - Environment variable "PORT" is not set',
      HTTP_PASSWORD_IS_NOT_SET:
        'Unprotected requests - Environment variable "HTTP_PASSWORD" is not set'
    }
  }
}

export const SteamHttp = {
  COMMUNITY: 'https://steamcommunity.com'
}

export const SteamThirdPartyServicesHttp = {
  STEAM_REP: 'https://steamrep.com',
  STEAM_TRADES: 'https://steamtrades.com',
  STEAM_LADDER: 'https://steamladder.com'
}
