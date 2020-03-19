type Options = {
  weekday?: string
  year?: string
  month?: string
  day?: string
}

/**
 * Formats the date using toLocaleDatestring.
 * accepts options for weekay, year, month and day.
 *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString
 */
export const formatDate = (date: Date, dateOptions: Options): string =>
  new Date(date).toLocaleDateString(undefined, dateOptions)
