import capitalize from 'lodash/capitalize'

import Loader from '@structures/Loader'

export default class ListenerLoader extends Loader {
  constructor (client) {
    super(client)
  }

  public load () {
    return this.loadFiles('listeners')
  }

  public loadFile (Listener, event: string) {
    const listener = new Listener(this.client)
    const prepareEvent = (event) =>
      this.client.on(event, (...variables) =>
        listener['on' + capitalize(event)](...variables)
      )

    if (listener.unifiedEvents) {
      listener.events.forEach(prepareEvent)
    } else {
      prepareEvent(event)
    }
  }
}
