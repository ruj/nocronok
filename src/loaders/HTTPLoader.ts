import express, { Express, Router } from 'express'

import Loader from '@structures/Loader'

export default class HTTPLoader extends Loader {
  public http: Express
  public router: Router

  constructor (client) {
    super(client)

    this.router = Router()
  }

  public load () {
    this.initializeHTTPServer()

    return this.loadFiles('http')
  }

  public loadFile (Route, name: string, parent: string) {
    const route = new Route(this.client, { name })

    if (!route.endpoints?.length) return false

    route.endpoints?.forEach(({ method, path, handler }) => {
      this.router[method.toLowerCase()](path, (...variables) =>
        route[handler](...variables)
      )

      this.http.use(
        `/${parent}/${route.name}${!path.startsWith('/') ? `/${path}` : path}`,
        this.router
      )
    })
  }

  private initializeHTTPServer (port = process.env.PORT) {
    if (!port) {
      return this.logger.warn(
        { labels: ['HTTPLoader'] },
        'Server not started - Environment variable "PORT" is not set'
      )
    }

    this.http = express()

    this.http.use(express.json())

    this.http.listen(port, () =>
      this.logger.info({ labels: ['HTTPLoader'] }, `Listening on port ${port}`)
    )
  }
}
