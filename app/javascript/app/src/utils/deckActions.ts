import axios from 'axios'
import { Deck } from '../interface'
import { toCamelcase } from '../utils'

export const deckActions = {
  all: async (): Promise<Array<Deck>> => {
    try {
      const response = await axios('/api/v1/decks')

      const { data } = response

      if (data.error) {
        throw new Error(data.error)
      }

      return toCamelcase(data)
    } catch (error) {
      console.log(`Unable to get decks. ${error}`)
    }
  },
}
