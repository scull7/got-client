/* @flow */

export function isNil(x: any): boolean {
  return (x === undefined || x === null)
}


export function propEither(prop: string, x: Object, y: Object): any {
  return isNil(y[prop]) ? x[prop] : y[prop]
}
