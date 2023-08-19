import type Nocronok from '@structures/base/Nocronok'
import Listener from '@structures/Listener'

export default class Ready extends Listener {
  constructor (client: Nocronok) {
    super(client)
  }

  public onReady () {
    this.logger.info({ labels: ['Listener', 'ready'] })
  }
}
