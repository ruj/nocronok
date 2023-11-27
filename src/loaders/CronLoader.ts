import { CronJob } from 'cron'

import { ICronJobContext } from '@interfaces'
import type Nocronok from '@structures/base/Nocronok'
import Cron from '@structures/Cron'
import Loader from '@structures/Loader'

export default class CronLoader extends Loader {
  constructor (client: Nocronok) {
    super(client)
  }

  public load () {
    this.isReady(this.loadFiles('cronjobs'))

    return true
  }

  public async loadFile (Job: any) {
    const job = new Job()

    this.initializeJob(job)
  }

  private initializeJob (job: Cron) {
    try {
      const cronJob = new CronJob(
        job.cronTime,
        job.onTick({ client: this.client } as ICronJobContext),
        job.onComplete,
        job.start,
        job.timeZone
      )

      cronJob.start()
    } catch (error: any) {
      this.logger.error(
        { labels: ['CronLoader', 'initializeJob()'] },
        error.message
      )
    }
  }

  private isReady (load: Promise<void>) {
    if (!this.client.isReady()) {
      setTimeout(() => this.isReady(load), 500)
    } else {
      return load
    }
  }
}
