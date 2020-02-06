import 'cross-fetch/polyfill'
import { buildCardParams, buildSetParams } from './paramsBuilder'

// Fetches all cards from https://mtgjson.com/
export const getAllCards = async () => {
  try {
    const response = await fetch('https://www.mtgjson.com/files/AllCards.json')

    const cards: Array<object> = Object.values(await response.json())

    // Formats the params to be saved to the DB
    const formattedParams = buildCardParams(cards)

    try {
      // Attempts to submit the card response to the DB
      await fetch('/update_cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cards: formattedParams }),
      })
    } catch (error) {
      console.log('There was an error, ', error)
    }
  } catch (error) {
    console.log('There was an error: ', error)
  }
}

// Fetches all cards from https://mtgjson.com/
export const getAllSets = async () => {
  try {
    const response = await fetch(
      'https://www.mtgjson.com/files/AllPrintings.json'
    )

    // Formats the params to be saved to the DB
    const formattedSetParams = buildSetParams(await response.json())

    try {
      // Attempts to submit the card response to the DB
      await fetch('/update_card_sets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedSetParams),
      })
    } catch (error) {
      console.log('There was an error, ', error)
    }
  } catch (error) {
    console.log('There was an error, ', error)
  }
}
