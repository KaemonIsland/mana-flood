import axios from 'axios'
import { toCamelcase } from '../utils'
import { Card } from '../../../mtgJsonApi/cardInterface'

/**
 * Gets a card information from Scryfall
 * https://scryfall.com/docs/api/cards/id
 *
 * @param {string} id - scryfall unique id
 *
 * @returns card image url
 */
export const getCard = async (id): Promise<Card> => {
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
 * @param {string} name - the card name used to identify card faces, if exist
 *
 * @returns card image url
 */
export const getCardImage = async (id, size = 'medium', name = ''): Promise<string> => {
  try {
    const response = await axios(`https://api.scryfall.com/cards/${id}`)

    const { data } = response

    const formatted = toCamelcase(data)

    let images

    if (formatted.imageUris) {
      images = formatted.imageUris
    } else if (formatted.cardFaces) {
      const card = formatted.cardFaces.find(cardFace => 
      cardFace.name.toLowerCase() === name.toLowerCase()
      )
      images = card && card.imageUris || ''
    }

    if (images) {
      return images[size] || images.first
    } else {
      return ''
    }
  } catch (error) {
    console.log('Unable to fetch card', error)
  }
}
