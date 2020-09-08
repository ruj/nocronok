const { ShardingManager } = require('discord.js')
const Logger = require('./Logger.js')

module.exports = class Sharding extends ShardingManager {
  constructor (options = {}) {
    super('core/index.js', options)

    this.logger = new Logger()
    this.on('shardCreate', (...v) => this.onShardCreate(...v))
  }

  onShardCreate (shard) {
    this.logger.print('Sharding', `Launching shard (${shard.id + 1}/${this.totalShards})`, { type: 'info' })
  }
}
