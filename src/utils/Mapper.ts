export default class Mapper<Key, Value> extends Map<Key, Value> {
  private _array: [Key, Value][] | undefined

  public array (): [Key, Value][] {
    if (!this._array || this._array.length !== this.size) {
      this._array = Array.from(this.entries())
    }

    return this._array
  }
}
