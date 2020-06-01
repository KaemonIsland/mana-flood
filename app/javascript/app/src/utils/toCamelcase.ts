import camelcaseKeys from 'camelcase-keys'

export const toCamelcase = (obj: Array<any> | any): Array<any> | any =>
  camelcaseKeys(obj, { deep: true })
