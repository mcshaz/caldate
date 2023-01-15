/**
 * pads a number with `0`s on the left
 * @param number The number or string to be padded
 * @param [len] - length of final string. default 2
 * @return padded string
 */
export function pad0 (number: number | string, len = 2): string {
  return number.toString().padStart(len, '0')
}

/**
 * convert string to an int if the string begins with numeric values
 * @param str The string to be parsed
 * @return The converted number or undefined if NaN
 */
export function toInt (str: string | number | undefined): number | undefined {
  const num = parseInt(str as string, 10)
  if (!isNaN(num)) {
    return num
  }
}
