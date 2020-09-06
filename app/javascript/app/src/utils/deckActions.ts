import { Deck } from '../interface'
import { request } from '../utils'

export const deckActions = {
  all: async (): Promise<Array<Deck>> =>
    await request('/api/v1/decks', error => {
      console.log(`Unable to get decks. ${error}`)
    }),
  create: async (deck: any): Promise<Deck> =>
    await request(
      'api/v1/decks',
      error => {
        console.log('Unable to create deck: ', error)
      },
      {
        method: 'post',
        data: deck,
      }
    ),
  update: async (id, info): Promise<Deck> =>
    await request(
      `api/v1/decks/${id}`,
      error => {
        console.log('unable to update deck: ', error)
      },
      {
        method: 'patch',
        data: info,
      }
    ),

  delete: async (id: number): Promise<void> =>
    await request(
      `api/v1/decks/${id}`,
      error => {
        console.log('Unable to remove deck: ', error)
      },
      {
        method: 'delete',
      }
    ),
}
