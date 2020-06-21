import { isArray } from './isArray'

export const isObject = (element: any): boolean =>
  element === Object(element) &&
  !isArray(element) &&
  typeof element !== 'function'
