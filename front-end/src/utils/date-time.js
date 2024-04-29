const dateFormat = /\d{4}-\d{2}-\d{2}/;
const timeFormat = /\d{2}:\d{2}/;

/**
 * Formats a Date object as YYYY-MM-DD.
 *
 * This function is *not* exported because the UI should generally avoid working directly with Date instances.
 * You may export this function if you need it.
 *
 * @param date
 *  an instance of a date object
 * @returns {string}
 *  the specified Date formatted as YYYY-MM-DD
 */
function asDateString(date: Date): string {
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
}

/**
 * Format an ISO-8601 date string as YYYY-MM-DD.
 *
 * @param dateString
 *  ISO-8601 date string
 * @returns {string}
 *  the specified date string formatted as YYYY-MM-DD
 */
export function formatAsDate(dateString: string): string {
  if (!dateString.match(dateFormat)) {
    throw new Error("Invalid date string");
  }
  return dateString.slice(0, 10);
}

/**
 * Format an ISO-8601 time string as HH:MM.
 *
 * @param timeString
 *  ISO-8601 time string
 * @returns {string}
 *  the specified time string formatted as HH:MM
 */
export function formatAsTime(timeString: string): string {
  if (!timeString.match(timeFormat)) {
    throw new Error("Invalid time string");
  }
  return timeString.slice(0, 5);
}

/**
 * Today's date as YYYY-MM-DD.
 *
 * @returns {string}
 *  the today's date formatted as YYYY-MM-DD
 */
export function today(): string {
  return asDateString(new Date());
}

/**
 * Subtracts one day from the specified date and return it in YYYY-MM-DD format.
 *
 * @param currentDate
 *  a date string in YYYY-MM-DD format (this is also ISO-8601 format)
 * @returns {string}
 *  the date one day prior to currentDate, formatted as YYYY-MM-DD
 */
export function previous(currentDate: string): string {
  const [year, month, day] = currentDate.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() - 1);
  return asDateString(date);
}

/**
 * Adds one day to the specified date and return it in YYYY-MM-DD format.
 *
 * @param currentDate
 *  a date string in YYYY-MM-DD format (this is also ISO-8601 format)
 * @returns {string}
 *  the date one day after currentDate, formatted as YYYY-MM-DD
 */
export function next(currentDate: string): string {
  const [year, month, day] = currentDate.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + 1);
  return asDateString(date);
}

/**
 * Checks if the specified date is not on a Tuesday.
 *
 * @param reservation_date
 *  a date string in YYYY-MM-DD format
 * @param errors
 *  an array of error messages
 */
export function isNotOnTuesday(reservation_date: string, errors: Array<string>): void {
  const [year, month, day] = reservation_date.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  if (date.getDay() === 2) {
    errors.push("Restaurant is closed on Tuesdays");
  }
}

/**
 * Checks if the specified date is in the future.
 *
 * @param reservation_date
 *  a date string in YYYY-MM-DD format
 * @param errors
 *  an array of error messages
 */
export function isInTheFuture(reservation_date: string, errors: Array<string>): void {
  const [year, month, day] = reservation_date.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const now = new Date();
  if (date < now) {
    errors.push("Reservation must be in the future");
  }
}
