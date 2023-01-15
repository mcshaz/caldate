import assert from 'assert/strict'
import { CalDate } from '../src/index'

describe('#CalDate', function () {
  it('can return 1900-01-01 if undefined', function () {
    const caldate = new CalDate()
    const res = caldate.toString()
    assert.strictEqual(res, '1900-01-01 00:00:00')
  })

  it('can explicitly have date set to undefined', function() {
    const caldate = new CalDate({year: undefined, month: 1, day: 1})
    assert.strictEqual(caldate.year, undefined)
  })

  it('will set year undefined if instantiated with date and month', function() {
    const caldate = new CalDate({month: 1, day: 1})
    assert.strictEqual(caldate.year, undefined)
  })

  it('can set year 2000', function () {
    const caldate = new CalDate()
    caldate.set({ year: 2000 })
    const res = caldate.toString()
    assert.strictEqual(res, '2000-01-01 00:00:00')
  })

  it('can set month February', function () {
    const caldate = new CalDate()
    caldate.set({ month: 2 })
    const res = caldate.toString()
    assert.strictEqual(res, '1900-02-01 00:00:00')
  })

  it('can set day 13', function () {
    const caldate = new CalDate()
    caldate.set({ day: 13 })
    const res = caldate.toString()
    assert.strictEqual(res, '1900-01-13 00:00:00')
  })

  it('can set hour 12', function () {
    const caldate = new CalDate()
    caldate.set({ hour: 12 })
    const res = caldate.toString()
    assert.strictEqual(res, '1900-01-01 12:00:00')
  })

  it('can set a date', function () {
    const caldate = new CalDate()
    caldate.set(new Date('1900-01-01 12:00:00'))
    const res = caldate.toString()
    assert.strictEqual(res, '1900-01-01 12:00:00')
  })

  it('can return a ISO String', function () {
    const caldate = new CalDate()
    caldate.set(new Date('1900-01-01 12:00:00'))
    const res = caldate.toISOString()
    assert.strictEqual(res, '1900-01-01T12:00:00Z')
  })

  it('can update a date', function () {
    const caldate = new CalDate({
      year: 2000,
      month: 2,
      day: 30,
      hour: 25,
      minute: 61,
      second: 62
    })
    const res = caldate.toString()
    assert.strictEqual(res, '2000-03-02 02:02:02')
  })

  it('can get weekday', function () {
    const caldate = new CalDate({
      year: 2000,
      month: 2,
      day: 30,
      hour: 25,
      minute: 61,
      second: 62
    })
    const res = caldate.getDay()
    assert.strictEqual(res, 4)
  })

  it('can check for equal date', function () {
    const caldate = new CalDate({
      year: 2000,
      month: 2,
      day: 30,
      hour: 25,
      minute: 61,
      second: 62
    })
    const caldate2 = new CalDate(new Date('2000-03-02 02:02:02'))
    const res = caldate.isEqualDate(caldate2)
    assert.strictEqual(res, true)
  })

  it('can move date by timezone', function () {
    const caldate = new CalDate(new Date('2000-01-01 00:00:00'))
    const res = caldate.toTimezone('America/New_York').toISOString()
    assert.strictEqual(res, '2000-01-01T05:00:00.000Z')
  })

  it('can move date by timezone with daylight saving offset', function () {
    const caldate = new CalDate(new Date('2000-07-01 00:00:00'))
    const res = caldate.toTimezone('America/New_York').toISOString()
    assert.strictEqual(res, '2000-07-01T04:00:00.000Z')
  })

  it('can return date in current timezone', function () {
    const caldate = new CalDate({ year: 2000, month: 1, day: 1 })
    const exp = new Date('2000-01-01 00:00:00')
    const res = caldate.toTimezone().toISOString()
    assert.strictEqual(res, exp.toISOString())
  })

  it('can set date for timezone', function () {
    const caldate = new CalDate()
    caldate.fromTimezone(
      new Date('2016-12-31T13:00:00Z'), 'Australia/Sydney'
    )
    assert.strictEqual(caldate.toString(), '2017-01-01 00:00:00')
  })

  it('can return an end date', function () {
    const caldate = new CalDate(new Date('2000-01-01 00:00:00'))
    const res = caldate.toEndDate().toISOString()
    assert.strictEqual(res, '2000-01-02T00:00:00Z')
  })

  it('returns an end date with default duration', function () {
    const caldate = new CalDate(new Date('2000-01-01 00:00:00'))
    const res = caldate.toEndDate().duration
    assert.strictEqual(res, 24)
  })

  it('can set offset in days', function () {
    let caldate = new CalDate(new Date('2000-01-01 00:00:00'))
    caldate.setOffset(5)
    let res = caldate.toISOString()
    assert.strictEqual(res, '2000-01-06T00:00:00Z')
    caldate = caldate.toEndDate()
    res = caldate.toISOString()
    assert.strictEqual(res, '2000-01-07T00:00:00Z')
  })

  it('can set undefined offset', function () {
    const caldate = new CalDate(new Date('2000-01-01 00:00:00'))
    caldate.setOffset()
    const res = caldate.toISOString()
    assert.strictEqual(res, '2000-01-01T00:00:00Z')
  })

  it('can set offset in hours', function () {
    const caldate = new CalDate(new Date('2000-01-01 00:00:00'))
    caldate.setOffset(12, 'h')
    const res = caldate.toISOString()
    assert.strictEqual(res, '2000-01-01T12:00:00Z')
  })

  it('can set offset in hours using a fraction', function () {
    const caldate = new CalDate(new Date('2000-01-01 00:00:00'))
    caldate.setOffset({ number: 12.555, unit: 'h' })
    const res = caldate.toISOString()
    assert.strictEqual(res, '2000-01-01T12:33:17Z')
  })

  it('can set offset in days', function () {
    const caldate = new CalDate(new Date('2000-01-01 00:00:00'))
    caldate.setOffset({ number: 1.55, unit: 'd' })
    const res = caldate.toISOString()
    assert.strictEqual(res, '2000-01-02T13:12:00Z')
  })

  it('throws if not a number', function () {
    const caldate = new CalDate(new Date('2000-01-01 00:00:00'))
    assert.throws(function () {
      caldate.setOffset('this is not a number' as unknown as number)
    }, Error)
  })

  it('setting time modifies duration so toEndDate remains midnight', function () {
    const caldate = new CalDate(new Date('2000-01-01 00:00:00'))
    caldate.setTime(12)
    let res = caldate.toISOString()
    assert.strictEqual(res, '2000-01-01T12:00:00Z')
    assert.strictEqual(caldate.duration, 12)
    res = caldate.toEndDate().toISOString()
    assert.strictEqual(res, '2000-01-02T00:00:00Z')
  })

  it('can set duration', function () {
    const caldate = new CalDate(new Date('2000-01-01 00:00:00'))
    caldate.setTime(12)
    caldate.setDuration(23)
    let res = caldate.toISOString()
    assert.strictEqual(res, '2000-01-01T12:00:00Z')
    res = caldate.toEndDate().toISOString()
    assert.strictEqual(res, '2000-01-02T11:00:00Z')
  })

  it('can clone self with new argument', function() {
    const caldate = new CalDate(new Date('2000-01-01 00:00:00'))
    caldate.setTime(12)
    caldate.setDuration(23.5)
    const res = new CalDate(caldate)
    assert.notEqual(res, caldate)
    assert.deepStrictEqual(res, caldate)
  })

  it('can get year from a number', function () {
    const res = CalDate.toYear(2000)
    assert.strictEqual(res, 2000)
  })

  it('can get year from a string', function () {
    const res = CalDate.toYear('2000')
    assert.strictEqual(res, 2000)
  })

  it('can get year from a Date', function () {
    const res = CalDate.toYear(new Date('2000-01-01'))
    assert.strictEqual(res, 2000)
  })

  it('can get current year', function () {
    const exp = (new Date()).getFullYear()
    const res = CalDate.toYear()
    assert.strictEqual(res, exp)
  })
})

describe('handles daylight saving jumps', function () {
  it('finds first time after clock jumps back: -ve UTC offset', function () {
    const caldate = new CalDate(new Date('2023-11-05 02:00:00'))
    const res = caldate.toTimezone('America/New_York').toISOString()
    // UTC 05:59 is NY 01:59 GMT -4
    // UTC 06:00 is NY 01:00 GMT -5
    // therefore the first time NY local 02:00 is struck is UTC 07:00
    assert.strictEqual(res, '2023-11-05T07:00:00.000Z')
  })

  it('finds first time after clock jumps back: +ve UTC offset', function () {
    const caldate = new CalDate(new Date('2023-04-02 03:00:00'))
    const res = caldate.toTimezone('Australia/Sydney').toISOString()
    // UTC 15:59 is SYD 02:59 GMT +11
    // UTC 16:00 is SYD 02:00 GMT +10
    // therefore the first time SYD local 03:00 is struck is UTC 17:00
    assert.strictEqual(res, '2023-04-01T17:00:00.000Z')
  })

  it('handles times that repeat when clock jump back: -ve UTC offset', function () {
    // at 02:00 local clock jumps back 1 hour so 01:00 occurs twice
    const caldate = new CalDate(new Date('2023-11-05 01:00:00'))
    const res = caldate.toTimezone('America/New_York').toISOString()
    // UTC 05:00 is NY 01:00 GMT -4
    // UTC 06:00 is NY 01:00 GMT -5
    // this implementation picks the later occurrence of 01:00 @ UTC 06:00
    assert.strictEqual(res, '2023-11-05T06:00:00.000Z')
  })

  it('handles times that repeat when clock jump back: +ve UTC offset', function () {
    // at 03:00 local clock jumps back 1 hour so 02:00 occurs twice
    const caldate = new CalDate(new Date('2023-04-02 02:00:00'))
    const res = caldate.toTimezone('Australia/Sydney').toISOString()
    // UTC 15:00 is SYD 02:00 GMT +11
    // UTC 16:00 is SYD 02:00 GMT +10
    // this implementation picks the later occurrence of 02:00 @ UTC 16:00
    assert.strictEqual(res, '2023-04-01T16:00:00.000Z')
  })

  // utc: 2023-09-30T16:00:00.000Z SYD: 03:00 GMT+11
  it('handles times that dont exist with clock jump forward: -ve UTC offset', function () {
    // at 02:00 local clock will immediately jump forward to 03:00
    const caldate = new CalDate(new Date('2023-03-12 02:00:00'))
    const res = caldate.toTimezone('America/New_York').toISOString()
    // UTC 06:59 is NY 01:59 GMT -5
    // UTC 07:00 is NY 03:00 GMT -4
    assert.strictEqual(res, '2023-03-12T07:00:00.000Z')
  })

  it('handles times that dont exist with clock jump forward: +ve UTC offset', function () {
    // at 02:00 local clock will immediately jump forward to 03:00
    const caldate = new CalDate(new Date('2023-10-01 02:00:00'))
    const res = caldate.toTimezone('Australia/Sydney').toISOString()
    // UTC 15:59 is SYD 01:59 GMT +10
    // UTC 16:00 is SYD 03:00 GMT +11
    assert.strictEqual(res, '2023-09-30T16:00:00.000Z')
  })
})
