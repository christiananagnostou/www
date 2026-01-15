interface Array<T> {
  toSorted(compareFn?: (a: T, b: T) => number): T[]
}

interface ReadonlyArray<T> {
  toSorted(compareFn?: (a: T, b: T) => number): T[]
}
