'use strict';

var esm = require('date-fns-tz/esm');
var toDate = require('date-fns-tz/esm/toDate');

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
function toNumber(str) {
  const num = parseInt(str, 10);
  if (!isNaN(num)) {
    return num;
  }
}
function zonedTimeToUtc(date, timeZone) {
  date = toDate(date);
  const returnVar = esm.zonedTimeToUtc(date, timeZone);
  const f = new Intl.DateTimeFormat("en", { timeZone, hourCycle: "h23", hour: "numeric" });
  if (parseInt(f.format(returnVar), 10) !== date.getHours())
    returnVar.setHours(returnVar.getHours() + 1);
  return returnVar;
}
var CalDate = class {
  constructor(opts) {
    this.year = 1900;
    this.month = 1;
    this.day = 1;
    this.hour = 0;
    this.minute = 0;
    this.second = 0;
    this.duration = 24;
    this.set(opts);
  }
  set(opts) {
    if (isDate(opts)) {
      opts = opts;
      this.year = opts.getFullYear();
      this.month = opts.getMonth() + 1;
      this.day = opts.getDate();
      this.hour = opts.getHours();
      this.minute = opts.getMinutes();
      this.second = opts.getSeconds();
    } else {
      this.transferOptsToSelf(opts);
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
        throw new Error("Number required");
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
    this.transferOptsToSelf({
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
      const d = new CalDate(this.toDate());
      d.duration = void 0;
      this.transferOptsToSelf(d);
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
    this.set(timezone ? esm.utcToZonedTime(dateUTC, timezone) : dateUTC);
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
  transferOptsToSelf(opts) {
    if (isObject(opts)) {
      Object.entries(opts).forEach(([k, v]) => {
        if (k in this) {
          const numbr = toNumber(v);
          if (numbr !== void 0)
            this[k] = numbr;
        }
      });
    }
  }
  static toYear(year) {
    if (!year) {
      return new Date().getFullYear();
    } else if (isDate(year)) {
      return year.getFullYear();
    } else if (typeof year === "string") {
      return toNumber(year);
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

Object.defineProperty(exports, 'utcToZonedTime', {
  enumerable: true,
  get: function () { return esm.utcToZonedTime; }
});
exports.CalDate = CalDate;
exports.isDate = isDate;
exports.isObject = isObject;
exports.pad0 = pad0;
exports.toNumber = toNumber;
exports.zonedTimeToUtc = zonedTimeToUtc;
