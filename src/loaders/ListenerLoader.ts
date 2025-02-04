import upperFirst from 'lodash/upperFirst'

import type Nocronok from '@structures/base/Nocronok'
import Loader from '@structures/Loader'

export default class ListenerLoader extends Loader {
  constructor (client: Nocronok) {
    super(client)
  }

  public async load (): Promise<void> {
    await this.loadFiles('listeners')
  }

  public loadFile (Listener: any, event: string): void {
    const listener = new Listener(this.client)
    const prepareEvent = (event: string): Nocronok =>
      this.client.on(event, (...variables) =>
        listener['on' + upperFirst(event)](...variables)
      )

    if (listener.unifiedEvents) {
      listener.events.forEach(prepareEvent)
    } else {
      prepareEvent(event)
    }
  }
}
