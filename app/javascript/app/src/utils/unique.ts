/**
 * Filter callback function to remove all duplicates
 *
 * @param val - any value within an array
 * @param index - index of val within array
 * @param self - Self reference of array val
 *
 * @returns if value is first occurring or not
 */
export const unique = (val: any, index: number, self: any): boolean =>
  self.indexOf(val) === index
