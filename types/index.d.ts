declare module 'caldate' {
  export interface Options {
    year?: string | number;
    month?: string | number;
    day?: string | number;
    hour?: string | number;
    minute?: string | number;
    second?: string | number;
    duration?: string | number;
  }

  export class CalDate {
    constructor(opts?: Date | Options);

    set(opts?: Date | Options): CalDate;
    isEqualDate(calDate: CalDate): boolean;
    getDay(): number;
    setOffset(number: number, unit?: string): CalDate;
    setTime(hour?: number, minute?: number, second?: number): CalDate;
    setDuration(duration: number): CalDate;
    update(): CalDate;
    toEndDate(): CalDate;
    toTimezone(timezone?: string): Date;
    fromTimezone(dateUTC: Date, timezone?: string): CalDate;
    toDate(): Date;
    toISOString(): string;
    toString(): string;
  }
}

/**
 * test if a variable is a non-null object
 * @param d variable to be tested
 * @returns true if an object which is not equal to null
 */
export function isObject(arg: unknown): boolean;

/**
 * test if a variable is a JavaScript Date, including across iFrame boundaries
 * @param d variable to be tested
 * @returns true if a Date
 */
export function isDate(d: unknown): boolean;

/**
 * pad number with '0's before
 * @param number the number to be padded
 * @param [len] - length. default 2
 * @return padded string
 */
export function pad0(number: number | string, len: number): string;

/**
 * convert string to number
 * @return converted number or undefined
 */
export function toNumber(str: string): number | undefined;

/**
 * extract or set year
 * @return the year as a number
 */
export function toYear(year: number | Date | string): number;
