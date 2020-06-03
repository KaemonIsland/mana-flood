import axios from 'axios'
import { toCamelcase } from '../utils'

/**
 * Gets a card img url from Scryfall
 * https://scryfall.com/docs/api/cards/id
 *
 * Image sizes could be small, normal and large.
 *
 * @param {string} id - scryfall unique id
 *
 * @returns card image url
 */
export const getCardImage = async (id, size = 'medium') => {
  try {
    const response = await axios(`https://api.scryfall.com/cards/${id}`)

    const { data } = response

    const formatted = toCamelcase(data)

    const cardUrl = formatted.imageUris && formatted.imageUris[size]

    return cardUrl
  } catch (error) {
    console.log('Unable to fetch card', error)
  }
}
