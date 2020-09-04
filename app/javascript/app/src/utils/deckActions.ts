import { Deck } from '../interface'
import { validateAsync } from '../utils'

export const deckActions = {
  all: async (): Promise<Array<Deck>> =>
    await validateAsync('/api/v1/decks', {}, error => {
      console.log(`Unable to get decks. ${error}`)
    }),
}
