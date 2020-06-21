import { isObject, isArray } from './index'

const toCamel = s => {
  return s.replace(/([-_][a-z])/gi, $1 => {
    return $1
      .toUpperCase()
      .replace('-', '')
      .replace('_', '')
  })
}

export const toCamelcase = (obj: Array<any> | any): Array<any> | any => {
  if (isObject(obj)) {
    const newObject = {}

    Object.keys(obj).forEach(key => {
      newObject[toCamel(key)] = toCamelcase(obj[key])
    })

    return newObject
  } else if (isArray(obj)) {
    return obj.map(item => {
      return toCamelcase(item)
    })
  }

  return obj
}

// console.log(obj)
// const updatedObject = camelcaseKeys(obj, { deep: true })
// return obj
