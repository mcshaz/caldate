export { default as utcToZonedTime } from 'date-fns-tz/esm/utcToZonedTime';

interface CalDateOptions {
    year?: string | number;
    month?: string | number;
    day?: string | number;
    hour?: string | number;
    minute?: string | number;
    second?: string | number;
    duration?: string | number;
}
interface CalDateInterface {
    year: number | undefined;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
    duration: number;
}
type offsetUnit = 'd' | 'h' | 'm';
declare class CalDate implements CalDateInterface {
    year: number | undefined;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
    duration: number;
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
    set(opts: CalDateOptions | Date): this;
    /**
     * checks if Date is equal to `calDate`
     * @param {CalDate} calDate
     * @return {Boolean} true if date matches
     */
    isEqualDate(calDate: CalDateInterface): boolean;
    /**
     * get day of week
     * @return {Number} day of week 0=sunday, 1=monday, ...
     */
    getDay(): number;
    setOffset(args: {
        number: number;
        unit?: offsetUnit;
    }): this;
    setOffset(number?: number, unit?: offsetUnit): this;
    /**
     * set hour, minute or second while altering duration so it remains the number of hours until midnight
     * @param [hour] default 0
     * @param [minute] default 0
     * @param [second] default 0
     */
    setTime(hour?: number, minute?: number, second?: number): this;
    /**
     * set duration in hours
     * @param {Number} duration in hours
     */
    setDuration(duration: number): this;
    /**
     * update internal data to real date
     */
    update(): this;
    /**
     * get end date of calendar date
     * @return {CalDate}
     */
    toEndDate(): CalDate;
    /**
     * return a UTC date when this calDate occured in the given `timezone`
     * @return {Date}
     */
    toTimezone(timeZone?: string): Date;
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
    toString(iso?: boolean): string;
    private assignDateToSelf;
    /**
     * extract year or return current year if argument is undefined
     * @param {Number|Date|String} year
     * @return {Number} year
     */
    static toYear(year?: number | Date | string): number;
}

declare function isObject(arg: unknown): boolean;
declare function isDate(d: unknown): boolean;
/**
 * pad number with `0`
 * @param {number} number
 * @param {number} [len] - length
 * @return {string} padded string
 */
declare function pad0(number: number | string, len?: number): string;
/**
 * convert string to number
 * @param {String} str
 * @return {Number} converted number or undefined if NaN
 */
declare function toInt(str: string | number | undefined): number | undefined;

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

export { CalDate, isDate, isObject, pad0, toInt as toNumber, zonedTimeToUtc };
