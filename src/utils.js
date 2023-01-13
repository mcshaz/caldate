function objectToString (o) {
  return Object.prototype.toString.call(o)
}

export function isObject (arg) {
  return typeof arg === 'object' && arg !== null
}

export function isDate (d) {
  return isObject(d) && objectToString(d) === '[object Date]'
}

/**
 * pad number with `0`
 * @param {number} number
 * @param {number} [len] - length
 * @return {string} padded string
 */
export function pad0 (number, len) {
  return number.toString().padStart(len || 2, '0')
}

/**
 * convert string to number
 * @param {String} str
 * @return {Number} converted number or undefined if NaN
 */
export function toNumber (str) {
  const num = parseInt(str, 10)
  if (!isNaN(num)) {
    return num
  }
}
