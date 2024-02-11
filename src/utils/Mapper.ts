export default class Mapper<Key, Value> extends Map<Key, Value> {
  public first (amount?: number): Value | Value[] | undefined {
    if (typeof amount === 'undefined') {
      return this.values().next().value
    }

    if (amount < 0) {
      return this.last(amount * -1)
    }

    amount = Math.min(this.size, amount)

    const iterable = this.values()

    return Array.from({ length: amount }, (): Value => iterable.next().value)
  }

  public firstKey (amount?: number): Key | Key[] | undefined {
    if (typeof amount === 'undefined') {
      return this.keys().next().value
    }

    if (amount < 0) {
      return this.lastKey(amount * -1)
    }

    amount = Math.min(this.size, amount)

    const iterable = this.keys()

    return Array.from({ length: amount }, (): Key => iterable.next().value)
  }

  public last (amount?: number): Value | Value[] | undefined {
    const array = [...this.values()]

    if (typeof amount === 'undefined') {
      return array[array.length - 1]
    }

    if (amount < 0) {
      return this.first(amount * -1)
    }

    if (!amount) {
      return []
    }

    return array.slice(-amount)
  }

  public lastKey (amount?: number): Key | Key[] | undefined {
    const array = [...this.keys()]

    if (typeof amount === 'undefined') {
      return array[array.length - 1]
    }

    if (amount < 0) {
      return this.firstKey(amount * -1)
    }

    if (!amount) {
      return []
    }

    return array.slice(-amount)
  }
}
