import { toInt, isDate, pad0 } from './utils'
import { zonedTimeToUtc } from './zonedTimeToUtc'
import utcToZonedTime from 'date-fns-tz/esm/utcToZonedTime'

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

type offsetUnit = 'd' | 'h' | 'm'

const defaultValues: Readonly<CalDateInterface> = {
  year: 1900,
  month: 1,
  day: 1,
  hour: 0,
  minute: 0,
  second: 0,
  duration: 24
}
const PROPS = new Set(Object.keys(defaultValues).filter(k => k !== 'duration'));
export class CalDate implements CalDateInterface {
  public year: number | undefined;
  public month: number;
  public day: number;
  public hour: number;
  public minute: number;
  public second: number;
  public duration: number;
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
  constructor (opts?: CalDateOptions | Date) {
    if (opts) {
      if (!(opts instanceof Date || opts instanceof CalDate)) {
        const newOps = Object.assign({}, defaultValues, opts)
        if (opts.month && !opts.year) newOps.year = undefined
        opts = newOps
      }
    } else {
      opts = defaultValues
    }
    this.set(opts)
  }

  set (opts: CalDateOptions | Date) {
    if (opts instanceof Date) {
      this.assignDateToSelf(opts as Date)
      this.duration = defaultValues.duration
    } else {
      Object.entries(opts).forEach(([k, v]) => {
        if (PROPS.has(k)) (this as any)[k] = toInt(v)
      })
      // assigning separately here as duration should retain decimal precision
      if (opts.duration) this.duration = Number(opts.duration)
    }
    return this
  }

  /**
   * checks if Date is equal to `calDate`
   * @param {CalDate} calDate
   * @return {Boolean} true if date matches
   */
  isEqualDate (calDate: CalDateInterface): boolean {
    this.update()
    return this.year === calDate.year && this.month === calDate.month && this.day === calDate.day
  }

  /**
   * get day of week
   * @return {Number} day of week 0=sunday, 1=monday, ...
   */
  getDay (): number {
    return this.toDate().getDay()
  }

  setOffset (args: {number: number, unit?: offsetUnit}): this;
  setOffset (number?: number, unit?: offsetUnit): this;
  setOffset (number?: number | {number: number, unit?: offsetUnit}, unit?: offsetUnit): this {
    if (number) {
      if (typeof number === 'object') {
        unit = number.unit
        number = number.number
      }
      unit = unit || 'd'
      number = Number(number)
      if (isNaN(number)) {
        throw new TypeError('Number required')
      }

      const o = { day: 0 } as {day: number; hour: number; minute: number; second: number }
      if (unit === 'd') {
        o.day = Math.trunc(number)
        number -= o.day
        number *= 24
      }
      if (unit === 'd' || unit === 'h') {
        o.hour = Math.trunc(number % 24)
        number -= o.hour
        number *= 60
      }
      o.minute = Math.trunc(number % 60)
      number -= o.minute
      number *= 60
      o.second = Math.trunc(number % 60)

      this.day += o.day
      this.hour += o.hour
      this.minute += o.minute
      this.second += o.second
    }
    this.update()
    return this
  }

  /**
   * set hour, minute or second while altering duration so it remains the number of hours until midnight
   * @param [hour] default 0
   * @param [minute] default 0
   * @param [second] default 0
   */
  setTime (hour = 0, minute = 0, second = 0): this {
    // the holiday usually ends at midnight - if this is not the case set different duration explicitely
    Object.assign(this, {
      hour,
      minute,
      second,
      duration: 24 - (hour + minute / 60 + second / 3600)
    })
    this.update()
    return this
  }

  /**
   * set duration in hours
   * @param {Number} duration in hours
   */
  setDuration (duration: number): this {
    this.duration = duration
    return this
  }

  /**
   * update internal data to real date
   */
  update (): this {
    if (this.year) {
      this.assignDateToSelf(this.toDate())
    }
    return this
  }

  /**
   * get end date of calendar date
   * @return {CalDate}
   */
  toEndDate (): CalDate {
    const d = new CalDate(this.toDate())
    d.minute += Math.trunc(this.duration * 60)
    d.update()
    return d
  }

  /**
   * return a UTC date when this calDate occured in the given `timezone`
   * @return {Date}
   */
  toTimezone (timeZone?: string): Date {
    if (timeZone) {
      return zonedTimeToUtc(this.toString(), timeZone)
    }
    return this.toDate()
  }

  /**
   * set date from a given `timezone`
   * @param {Date} dateUTC - date in UTC
   * @param {String} [timezone] - timezone of dateUTC, e.g. 'America/New_York'
   * @return {CalDate} self
   */
  fromTimezone (dateUTC: Date, timezone?: string): CalDate {
    this.set(timezone ? utcToZonedTime(dateUTC, timezone): dateUTC)
    return this
  }

  /**
   * convert to Date
   * @return {Date}
   */
  toDate (): Date {
    return new Date(
      this.year!, this.month - 1, this.day,
      this.hour, this.minute, this.second, 0
    )
  }

  /**
   * get Date in ISO format
   */
  toISOString () {
    return this.toString(true)
  }

  /**
   * get Date as String `YYYY-MM-DD HH:MM:SS`
   */
  toString (iso = false) {
    const d = new CalDate(this.toDate())
    return (
      pad0(d.year!, 4) + '-' +
      pad0(d.month) + '-' +
      pad0(d.day) +
      (iso ? 'T' : ' ') +
      pad0(d.hour) + ':' +
      pad0(d.minute) + ':' +
      pad0(d.second) +
      (iso ? 'Z' : '')
    )
  }
  private assignDateToSelf(dt: Date) {
    this.year = dt.getFullYear()
    this.month = dt.getMonth() + 1
    this.day = dt.getDate()
    this.hour = dt.getHours()
    this.minute = dt.getMinutes()
    this.second = dt.getSeconds()
  }
  /**
   * extract year or return current year if argument is undefined
   * @param {Number|Date|String} year
   * @return {Number} year
   */
    static toYear (year?: number | Date | string): number {
      if (!year) {
        return new Date().getFullYear()
      } else if (isDate(year)) {
        return (year as Date).getFullYear()
      } else if (typeof year === 'string') {
        return toInt(year) as number
      }
      return year as number
    }
}
