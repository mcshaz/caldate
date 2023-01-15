function objectToString (o: unknown) {
  return Object.prototype.toString.call(o) as string
}

export function isObject (arg: unknown) {
  return typeof arg === 'object' && arg !== null
}

export function isDate (d: unknown) {
  return isObject(d) && objectToString(d) === '[object Date]'
}

/**
 * pad number with `0`
 * @param {number} number
 * @param {number} [len] - length
 * @return {string} padded string
 */
export function pad0 (number: number | string, len = 2): string {
  return number.toString().padStart(len, '0')
}

/**
 * convert string to number
 * @param {String} str
 * @return {Number} converted number or undefined if NaN
 */
export function toInt (str: string | number | undefined): number | undefined {
  const num = parseInt(str as string, 10)
  if (!isNaN(num)) {
    return num
  }
}
