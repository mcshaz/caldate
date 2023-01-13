declare interface CalDateOptions {
  year?: string | number;
  month?: string | number;
  day?: string | number;
  hour?: string | number;
  minute?: string | number;
  second?: string | number;
  duration?: string | number;
}

declare class CalDate {
  static toYear(year: any): number;
  /**
   * constructs a new CalDate instance
   * @param {Object|Date} [opts] - See `set(opts)`
   * @example
   * const CalDate = require('caldate')
   * const caldate = new CalDate('2000-01-01 12:00:00')
   * caldate.year
   * //> 2000
   * caldate.month
   * //> 1
   */
  constructor(opts?: CalDateOptions | Date);
  /**
   * set calendar date
   * @param {Object|Date} [opts] - defaults to `1900-01-01`
   * @param {String} opts.year
   * @param {String} opts.month - January equals to 1, December to 12
   * @param {String} opts.day
   * @param {String} opts.hour
   * @param {String} opts.minute
   * @param {String} opts.second
   * @param {String} opts.duration - defaults to 24 hours
   */
  set(opts?: CalDateOptions | Date): CalDate;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  duration: number;
  /**
   * checks if Date is equal to `calDate`
   * @param {CalDate} calDate
   * @return {Boolean} true if date matches
   */
  isEqualDate(calDate: CalDate): boolean;
  /**
   * get day of week
   * @return {Number} day of week 0=sunday, 1=monday, ...
   */
  getDay(): number;
  /**
   * set offset per unit
   * @param {Number} number
   * @param {String} [unit='d'] - Unit in days `d`, hours `h, minutes `m`
   * @return {CalDate} this
   */
  setOffset(number: number, unit?: string): any;
  /**
   * set time per hour, minute or second while maintaining duration at midnight
   * @param {Number} [hour]
   * @param {Number} [minute]
   * @param {Number} [second]
   * @return {CalDate} this
   */
  setTime(hour?: number, minute?: number, second?: number): any;
  /**
   * set duration in hours
   * @param {Number} duration in hours
   * @return {CalDate} this
   */
  setDuration(duration: number): any;
  /**
   * update internal data to real date
   * @return {CalDate} this
   */
  update(): any;
  /**
   * get end date of calendar date
   * @return {CalDate}
   */
  toEndDate(): CalDate;
  /**
   * return a UTC date when this calDate occured in the given `timezone`
   * @param {String} timezone locale or timezone offset to UTC - e.g. 'America/New_York' or '+07:30'
   * @return {Date}
   */
  toTimezone(timeZone: any): Date;
  /**
   * set date from a given `timezone`
   * @param {Date} dateUTC - date in UTC
   * @param {String} [timezone] - timezone of dateUTC, e.g. 'America/New_York'
   * @return {CalDate} self
   */
  fromTimezone(dateUTC: Date, timezone?: string): CalDate;
  /**
   * convert to Date
   * @return {Date}
   */
  toDate(): Date;
  /**
   * get Date in ISO format
   */
  toISOString(): string;
  /**
   * get Date as String `YYYY-MM-DD HH:MM:SS`
   */
  toString(iso: any): string;
}

declare function isObject(arg: any): boolean;
declare function isDate(d: any): boolean;
/**
 * pad number with `0`
 * @param {number} number
 * @param {number} [len] - length
 * @return {string} padded string
 */
declare function pad0(number: number, len?: number): string;
/**
 * convert string to number
 * @param {String} str
 * @return {Number} converted number or undefined if NaN
 */
declare function toNumber(str: string): number;
/**
 * extract year or return current year if argument is undefined
 * @param {Number|Date|String} year
 * @return {Number} year
 */
declare function toYear(year: number | Date | string): number;

/**
 * @summary Get the UTC date/time from a date representing local time in a given time zone
 * @author Marnus Weststrate (date-fns-tz)
 * @license MIT
 * @description
 * Returns a date instance with the UTC time of the provided date of which the values
 * represented the local time in the time zone specified. In other words, if the input
 * date represented local time in time time zone, the timestamp of the output date will
 * give the equivalent UTC of that local time regardless of the current system time zone.
 *
 * @param {Date|String|Number} date - the date with values representing the local time
 * @param {String} timeZone - the time zone of this local time, can be an offset or IANA time zone
 * @returns {Date} the new date with the equivalent time in the time zone
 * @throws {TypeError} 2 arguments required
 *
 * @example
 * // In June 10am in Los Angeles is 5pm UTC
 * const result = zonedTimeToUtc(new Date(2014, 5, 25, 10, 0, 0), 'America/Los_Angeles')
 * //=> 2014-06-25T17:00:00.000Z
 */
declare function zonedTimeToUtc(date: Date | string | number, timeZone: string): Date;
/**
 * @summary Get a date/time representing local time in a given time zone from the UTC date
 * @author Marnus Weststrate (date-fns-tz)
 * @license MIT
 * @description
 * Returns a date instance with values representing the local time in the time zone
 * specified of the UTC time from the date provided. In other words, when the new date
 * is formatted it will show the equivalent hours in the target time zone regardless
 * of the current system time zone.
 *
 * @param {Date|String|Number} date - the date with the relevant UTC time
 * @param {String} timeZone - the time zone to get local time for, can be an offset or IANA time zone
 * @returns {Date} the new date with the equivalent time in the time zone
 * @throws {TypeError} 2 arguments required
 *
 * @example
 * // In June 10am UTC is 6am in New York (-04:00)
 * const result = utcToZonedTime('2014-06-25T10:00:00.000Z', 'America/New_York')
 * //=> Jun 25 2014 06:00:00
 */
declare function utcToZonedTime(date: Date | string | number, timeZone: string): Date;

export { CalDate, isDate, isObject, pad0, toNumber, toYear, utcToZonedTime, zonedTimeToUtc };
