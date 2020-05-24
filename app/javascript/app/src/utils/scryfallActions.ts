import axios from 'axios'

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
