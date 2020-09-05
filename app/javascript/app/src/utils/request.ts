import { toCamelcase } from './toCamelcase'
import axios, { AxiosResponse } from 'axios'

const validateAsync = (response: AxiosResponse): any => {
  const { data } = response

  if (data.error) {
    throw new Error(data.error)
  }

  return toCamelcase(data)
}

/**
 * Validates response and returns in camelcase format.
 */
export const request = async (
  url: string,
  errorFn: CallableFunction,
  options: any = {}
): Promise<any> => {
  try {
    const response = await axios(url, options)

    return validateAsync(response)
  } catch (error) {
    errorFn(error)
  }
}
