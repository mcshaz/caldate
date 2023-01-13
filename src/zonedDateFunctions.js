// exporting here so that only this file needs to change if changing which locale/timezone library to use
// keep an eye on the Temporal EcmaScript spec, which might be worth using once approved
import { zonedTimeToUtc as _zonedTimeToUtc, utcToZonedTime, toDate } from 'date-fns-tz/esm'

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
function zonedTimeToUtc (date, timeZone) {
  // currently - the date-fns-tz zonedTimeToUtc function has unexpected behaviour:
  // when set on a zoned time which doesn't exist due to daylight saving jumping forward, the hour before the jump is chosen
  // once the bug in zoneTimeToUtc is fixed, delete this hack & simply reexport the zonedTimeToUtc function
  // https://github.com/marnusw/date-fns-tz/issues/222
  date = toDate(date)
  const returnVar = _zonedTimeToUtc(date, timeZone)
  // Date.prototype.toLocaleString may work equally well, BUT it has been around longer than Intl.DateTimeFormat and initial implementations differed
  // therefore in older browsers it would seem more likely Intl.DateTimeFormat has been polyfilled with something spec compliant
  const f = new Intl.DateTimeFormat('en', { timeZone, hourCycle: 'h23', hour: 'numeric' })
  if (parseInt(f.format(returnVar), 10) !== date.getHours()) returnVar.setHours(returnVar.getHours() + 1)
  return returnVar
}

/*
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

export { zonedTimeToUtc, utcToZonedTime }
