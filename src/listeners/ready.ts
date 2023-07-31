import Listener from '@structures/Listener'

export default class Ready extends Listener {
  constructor (client) {
    super(client)
  }

  public onReady () {
    this.logger.info({ label: ['ready'] })
  }
}
