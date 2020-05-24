import axios from 'axios'

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
export const getCardImage = async id => {
  try {
    const response = await axios(`https://api.scryfall.com/cards/${id}`)

    const { data } = response

    const cardUrl = data.image_uris && data.image_uris.normal

    return cardUrl
  } catch (error) {
    console.log('Unable to fetch card', error)
  }
}
