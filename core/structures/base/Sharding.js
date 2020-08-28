const { ShardingManager } = require('discord.js')

module.exports = class Sharding extends ShardingManager {
  constructor (options = {}) {
    super('core/index.js', options)

    this.on('shardCreate', (...v) => this.onShardCreate(...v))
  }

  onShardCreate (shard) {
    console.log(`Launching shard (${shard.id + 1}/${this.totalShards})`)
  }
}
