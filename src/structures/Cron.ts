import { ICronJobContext, ICronOptions, IOptionHandler } from '@interfaces'
import { optionHandler } from '@utils'

export default abstract class Cron {
  private cronOptions: IOptionHandler
  public cronTime: string
  public abstract onTick(context: ICronJobContext): () => void
  public onComplete?: any
  public start?: boolean
  public timeZone?: string

  constructor (options: ICronOptions) {
    this.cronOptions = optionHandler('Cron', options)

    this.cronTime = this.cronOptions.required('cronTime')
    this.onComplete = this.cronOptions.default('onComplete', null)
    this.start = this.cronOptions.default('start', true)
    this.timeZone = this.cronOptions.default('timeZone', 'America/Sao_Paulo')
  }
}
