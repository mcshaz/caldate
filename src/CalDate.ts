import { toNumber, isDate, pad0, isObject } from './utils'
import { zonedTimeToUtc } from './zonedTimeToUtc'
import { utcToZonedTime } from 'date-fns-tz/esm'

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
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  duration: number;
}

type offsetUnit = 'd' | 'h' | 'm'

export class CalDate implements CalDateInterface {

  public year = 1900;
  public month = 1;
  public day = 1;
  public hour = 0;
  public minute = 0;
  public second = 0;
  public duration = 24;
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
    this.set(opts)
  }

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
  set (opts?: CalDateOptions | Date) {
    if (isDate(opts)) {
      opts = opts as Date
      this.year = opts.getFullYear()
      this.month = opts.getMonth() + 1
      this.day = opts.getDate()
      this.hour = opts.getHours()
      this.minute = opts.getMinutes()
      this.second = opts.getSeconds()
    } else {
      this.transferOptsToSelf(opts as CalDateOptions);
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
        throw new Error('Number required')
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
   * @param {Number} [hour]
   * @param {Number} [minute]
   * @param {Number} [second]
   * @return {Object} this
   */
  setTime (hour: number = 0, minute: number = 0, second: number = 0): this {
    // the holiday usually ends at midnight - if this is not the case set different duration explicitely
    this.transferOptsToSelf({
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
      const d = new CalDate(this.toDate())
      d.duration = undefined as any
      this.transferOptsToSelf(d)
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
      this.year, this.month - 1, this.day,
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
      pad0(d.year, 4) + '-' +
      pad0(d.month) + '-' +
      pad0(d.day) +
      (iso ? 'T' : ' ') +
      pad0(d.hour) + ':' +
      pad0(d.minute) + ':' +
      pad0(d.second) +
      (iso ? 'Z' : '')
    )
  }

  private transferOptsToSelf(opts: CalDateOptions) {
    if (isObject(opts)) {
      Object.entries(opts as Record<string, string | number | undefined>).forEach(([k, v]) => {
        if (k in this) {
          const numbr = toNumber(v)
          if (numbr !== undefined) (this as any)[k] = numbr
        }
      })
    }
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
        return toNumber(year) as number
      }
      return year as number
    }
}
