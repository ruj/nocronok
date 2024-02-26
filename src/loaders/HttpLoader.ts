import express, {
  type RequestHandler,
  type Express,
  type NextFunction,
  type Request,
  type Response
} from 'express'
import type { Logger } from 'pino'

import { type IRouteEndpoint } from '@interfaces'
import type Nocronok from '@structures/base/Nocronok'
import Loader from '@structures/Loader'
import { Errors } from '@utils/Constants'

type ParsedQs = Record<string, string | string[]>
type SafeRouter = RequestHandler<
  Record<string, unknown>,
  any,
  any,
  ParsedQs,
  Record<string, any>
>

export default class HttpLoader extends Loader {
  public http: Express

  constructor (client: Nocronok) {
    super(client)

    this.http = express()
  }

  public async load (): Promise<void> {
    this.initializeHTTPServer()

    await this.loadFiles('http')
  }

  public loadFile (Route: any, name: string, parent: string): false | undefined {
    const route = new Route(this.client, { name })

    if (!route.endpoints?.length) return false

    route.endpoints?.forEach(({ method, path, handler }: IRouteEndpoint) => {
      const toLowerCase = <Type extends string>(value: Type): Lowercase<Type> =>
        value.toLowerCase() as Lowercase<Type>

      route.router[toLowerCase(method)](path, (...variables: unknown[]) =>
        route[handler ?? 'handler'](...variables)
      )

      this.http.use(
        `/${parent}/${route.name}${!path.startsWith('/') ? `/${path}` : path}`,
        route.router as SafeRouter
      )
    })
  }

  private initializeHTTPServer (
    port = this.client.defaultOptions.env.PORT
  ): void {
    if (!port) {
      this.logger.warn(
        { labels: ['HttpLoader'] },
        Errors.Loaders.HttpLoader.PORT_IS_NOT_SET
      )
      return
    }

    this.http.use(express.json())
    this.http.use(this.passwordValidation(this.logger))

    this.http.listen(port, () => {
      this.logger.info({ labels: ['HttpLoader'] }, `Listening on port ${port}`)
    })
  }

  private passwordValidation (logger: Logger) {
    return (request: Request, response: Response, next: NextFunction) => {
      const httpPassword = this.client.defaultOptions.env.HTTP_PASSWORD

      if (!httpPassword) {
        logger.warn(
          { labels: ['HttpLoader'] },
          Errors.Loaders.HttpLoader.HTTP_PASSWORD_IS_NOT_SET
        )

        next()
        return
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
