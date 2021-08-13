type Options = {
  weekday?: string
  year?: string | any
  month?: string | any
  day?: string | any
}

/**
 * Formats the date using toLocaleDatestring.
 * accepts options for weekay, year, month and day.
 *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString
 */
export const formatDate = (
  date: Date,
  { month = 'long', year = 'numeric', day = 'numeric' }: Options
): string => {
  const dateOptions = { month, year, day }

  return new Date(date).toLocaleDateString(undefined, dateOptions)
}
