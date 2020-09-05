import { Deck } from '../interface'
import { request } from '../utils'

export const deckActions = {
  all: async (): Promise<Array<Deck>> =>
    await request('/api/v1/decks', error => {
      console.log(`Unable to get decks. ${error}`)
    }),
}
