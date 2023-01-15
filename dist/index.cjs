'use strict';

var _zonedTimeToUtc = require('date-fns-tz/zonedTimeToUtc');
var toDate = require('date-fns-tz/toDate');
var utcToZonedTime = require('date-fns-tz/utcToZonedTime');

// src/utils.ts
function objectToString(o) {
  return Object.prototype.toString.call(o);
}
function isObject(arg) {
  return typeof arg === "object" && arg !== null;
}
function isDate(d) {
  return isObject(d) && objectToString(d) === "[object Date]";
}
function pad0(number, len = 2) {
  return number.toString().padStart(len, "0");
}
function toInt(str) {
  const num = parseInt(str, 10);
  if (!isNaN(num)) {
    return num;
  }
}
function zonedTimeToUtc(date, timeZone) {
  date = toDate(date);
  const returnVar = _zonedTimeToUtc(date, timeZone);
  const f = new Intl.DateTimeFormat("en", { timeZone, hourCycle: "h23", hour: "numeric" });
  if (parseInt(f.format(returnVar), 10) !== date.getHours())
    returnVar.setHours(returnVar.getHours() + 1);
  return returnVar;
}
var defaultValues = {
  year: 1900,
  month: 1,
  day: 1,
  hour: 0,
  minute: 0,
  second: 0,
  duration: 24
};
var PROPS = new Set(Object.keys(defaultValues).filter((k) => k !== "duration"));
var CalDate = class {
  constructor(opts) {
    if (opts) {
      if (!(opts instanceof Date || opts instanceof CalDate)) {
        const newOps = Object.assign({}, defaultValues, opts);
        if (opts.month && !opts.year)
          newOps.year = void 0;
        opts = newOps;
      }
    } else {
      opts = defaultValues;
    }
    this.set(opts);
  }
  set(opts) {
    if (opts instanceof Date) {
      this.assignDateToSelf(opts);
      this.duration = defaultValues.duration;
    } else {
      Object.entries(opts).forEach(([k, v]) => {
        if (PROPS.has(k))
          this[k] = toInt(v);
      });
      if (opts.duration)
        this.duration = Number(opts.duration);
    }
    return this;
  }
  isEqualDate(calDate) {
    this.update();
    return this.year === calDate.year && this.month === calDate.month && this.day === calDate.day;
  }
  getDay() {
    return this.toDate().getDay();
  }
  setOffset(number, unit) {
    if (number) {
      if (typeof number === "object") {
        unit = number.unit;
        number = number.number;
      }
      unit = unit || "d";
      number = Number(number);
      if (isNaN(number)) {
        throw new TypeError("Number required");
      }
      const o = { day: 0 };
      if (unit === "d") {
        o.day = Math.trunc(number);
        number -= o.day;
        number *= 24;
      }
      if (unit === "d" || unit === "h") {
        o.hour = Math.trunc(number % 24);
        number -= o.hour;
        number *= 60;
      }
      o.minute = Math.trunc(number % 60);
      number -= o.minute;
      number *= 60;
      o.second = Math.trunc(number % 60);
      this.day += o.day;
      this.hour += o.hour;
      this.minute += o.minute;
      this.second += o.second;
    }
    this.update();
    return this;
  }
  setTime(hour = 0, minute = 0, second = 0) {
    Object.assign(this, {
      hour,
      minute,
      second,
      duration: 24 - (hour + minute / 60 + second / 3600)
    });
    this.update();
    return this;
  }
  setDuration(duration) {
    this.duration = duration;
    return this;
  }
  update() {
    if (this.year) {
      this.assignDateToSelf(this.toDate());
    }
    return this;
  }
  toEndDate() {
    const d = new CalDate(this.toDate());
    d.minute += Math.trunc(this.duration * 60);
    d.update();
    return d;
  }
  toTimezone(timeZone) {
    if (timeZone) {
      return zonedTimeToUtc(this.toString(), timeZone);
    }
    return this.toDate();
  }
  fromTimezone(dateUTC, timezone) {
    this.set(timezone ? utcToZonedTime(dateUTC, timezone) : dateUTC);
    return this;
  }
  toDate() {
    return new Date(
      this.year,
      this.month - 1,
      this.day,
      this.hour,
      this.minute,
      this.second,
      0
    );
  }
  toISOString() {
    return this.toString(true);
  }
  toString(iso = false) {
    const d = new CalDate(this.toDate());
    return pad0(d.year, 4) + "-" + pad0(d.month) + "-" + pad0(d.day) + (iso ? "T" : " ") + pad0(d.hour) + ":" + pad0(d.minute) + ":" + pad0(d.second) + (iso ? "Z" : "");
  }
  assignDateToSelf(dt) {
    this.year = dt.getFullYear();
    this.month = dt.getMonth() + 1;
    this.day = dt.getDate();
    this.hour = dt.getHours();
    this.minute = dt.getMinutes();
    this.second = dt.getSeconds();
  }
  static toYear(year) {
    if (!year) {
      return new Date().getFullYear();
    } else if (isDate(year)) {
      return year.getFullYear();
    } else if (typeof year === "string") {
      return toInt(year);
    }
    return year;
  }
};
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

exports.utcToZonedTime = utcToZonedTime;
exports.CalDate = CalDate;
exports.isDate = isDate;
exports.isObject = isObject;
exports.pad0 = pad0;
exports.toNumber = toInt;
exports.zonedTimeToUtc = zonedTimeToUtc;
