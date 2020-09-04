import { toCamelcase } from './toCamelcase'
import axios from 'axios'

/**
 * Validates response and returns in camelcase format.
 */
export const validateAsync = async (
  url: string,
  options: any,
  errorFn: CallableFunction
): Promise<any> => {
  try {
    const response = await axios(url, options)

    const { data } = response

    if (data.error) {
      throw new Error(data.error)
    }

    return toCamelcase(data)
  } catch (error) {
    errorFn(error)
  }
}
