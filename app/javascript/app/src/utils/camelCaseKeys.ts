import camelcaseKeys from 'camelcase-keys'

export const toCamelcase = (obj: object): Array<object> | object =>
  camelcaseKeys(obj, { deep: true })
