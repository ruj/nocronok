import express, { Express, NextFunction, Request, Response } from 'express'
import type { Logger } from 'pino'

import { IRouteEndpoint } from '@interfaces'
import type Nocronok from '@structures/base/Nocronok'
import Loader from '@structures/Loader'

export default class HttpLoader extends Loader {
  public http: Express

  constructor (client: Nocronok) {
    super(client)

    this.http = express()
  }

  public load () {
    this.initializeHTTPServer()

    return this.loadFiles('http')
  }

  public loadFile (Route: any, name: string, parent: string) {
    const route = new Route(this.client, { name })

    if (!route.endpoints?.length) return false

    route.endpoints?.forEach(({ method, path, handler }: IRouteEndpoint) => {
      const toLowerCase = <T extends string>(value: T) =>
        value.toLowerCase() as Lowercase<T>

      route.router[toLowerCase(method)](path, (...variables: unknown[]) =>
        route[handler ?? 'handler'](...variables)
      )

      this.http.use(
        `/${parent}/${route.name}${!path.startsWith('/') ? `/${path}` : path}`,
        route.router
      )
    })
  }

  private initializeHTTPServer (port = process.env.PORT) {
    if (!port) {
      return this.logger.warn(
        { labels: ['HttpLoader'] },
        'Server not started - Environment variable "PORT" is not set'
      )
    }

    this.http.use(express.json())
    this.http.use(this.passwordValidation(this.logger))

    this.http.listen(port, () =>
      this.logger.info({ labels: ['HttpLoader'] }, `Listening on port ${port}`)
    )
  }

  private passwordValidation (logger: Logger) {
    return (request: Request, response: Response, next: NextFunction) => {
      const httpPassword = process.env.HTTP_PASSWORD

      if (!httpPassword) {
        logger.warn(
          { labels: ['HttpLoader'] },
          'Unprotected requests - Environment variable "HTTP_PASSWORD" is not set'
        )

        return next()
      }

      const password = request.headers['X-Password'.toLowerCase()]

      if (!password || password !== httpPassword) {
        return response
          .status(401)
          .json({ status: 401, message: 'Unauthorized' })
      }

      next()
    }
  }
}
