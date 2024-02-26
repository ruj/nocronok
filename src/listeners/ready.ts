import type Nocronok from '@structures/base/Nocronok'
import Listener from '@structures/Listener'

export default class Ready extends Listener {
  constructor (client: Nocronok) {
    super(client)
  }

  public onReady (): void {
    this.logger.info(
      { labels: ['Listener', 'ready'] },
      `Connected as ${this.client.user?.tag}`
    )
  }
}
