import axios from 'axios'
import { toCamelcase } from '../utils'

interface Prices {
  usd: number
  usdFoil: number
}

interface ScryfallCard {
  prices?: Prices
}

/**
 * Gets a card information from Scryfall
 * https://scryfall.com/docs/api/cards/id
 *
 * @param {string} id - scryfall unique id
 *
 * @returns card image url
 */
export const getCard = async (id): Promise<ScryfallCard> => {
  try {
    const response = await axios(`https://api.scryfall.com/cards/${id}`)

    const { data } = response

    const formatted = toCamelcase(data)

    return formatted
  } catch (error) {
    console.log('Unable to fetch card', error)
  }
}

/**
 * Gets a card img url from Scryfall
 * https://scryfall.com/docs/api/cards/id
 *
 * @param {string} id - scryfall unique id
 * @param {string} size - can be small, normal or large
 *
 * @returns card image url
 */
export const getCardImage = async (
  id,
  size = 'medium'
): Promise<Array<string>> => {
  try {
    const response = await axios(`https://api.scryfall.com/cards/${id}`)

    const { data } = response

    const formatted = toCamelcase(data)

    const images = []

    // Card has single face and image uris
    if (formatted.imageUris && formatted.imageUris[size]) {
      images.push(formatted.imageUris[size])
      // Card has multiple faces
    } else if (formatted.cardFaces) {
      formatted.cardFaces.forEach(cardFace => {
        if (cardFace.imageUris && cardFace.imageUris[size]) {
          images.push(cardFace.imageUris[size])
        }
      })
    }

    return images
  } catch (error) {
    console.log('Unable to fetch card', error)
  }
}
