import { Card, CardSet } from '../interface'
import { request } from '../utils'

/**
 * Contains all API calls related to the users collection
 */
export const collectionActions = {
  card: async (id: number): Promise<Card> =>
    await request(`/api/v1/card/${id}`, error => {
      console.log('Unable to get card: ', error)
    }),
  search: async (query: URLSearchParams): Promise<Array<Card>> =>
    await request(
      '/api/v1/search',
      error => {
        console.log('Unable to get cards: ', error)
      },
      {
        params: query,
      }
    ),
  all: async (query: URLSearchParams): Promise<Array<CardSet>> =>
    await request(
      '/api/v1/collection',
      error => {
        console.log('Unable to get cards: ', error)
      },
      {
        params: query,
      }
    ),
  sets: async (): Promise<Array<CardSet>> =>
    await request('/api/v1/collection/sets', error => {
      console.log('Unable to get cards: ', error)
    }),
  collection: async (query: URLSearchParams, id: number): Promise<void> =>
    await request(
      `/api/v1/collection/set/${id}`,
      error => {
        console.log('Unable to get cards from collection', error)
      },
      {
        params: query,
      }
    ),
  set: async (query: URLSearchParams, id: number): Promise<void> =>
    await request(
      `/api/v1/sets/${id}/collection`,

      error => {
        console.log('Unable to get cards from collection', error)
      },
      {
        params: query,
      }
    ),
  add: async (id: number, options: any = {}): Promise<Card> =>
    await request(
      `/api/v1/add_card/${id}`,
      error => {
        console.log('Unable to add card to collection', error)
      },
      {
        method: 'post',
        ...options,
      }
    ),
  update: async (
    id: number,
    quantity: number,
    options: any = {}
  ): Promise<Card> =>
    await request(
      `/api/v1/add_card/${id}?quantity=${quantity}`,

      error => {
        console.log('Unable to update card collection quantity', error)
      },
      {
        method: 'put',
        ...options,
      }
    ),
  remove: async (id: number, options: any = {}): Promise<Card> =>
    await request(
      `/api/v1/remove_card/${id}`,

      error => {
        console.log('Unable to remove card to collection', error)
      },
      {
        method: 'delete',
        ...options,
      }
    ),
}

/**
 * Contains all API calls related to a users deck
 */
export const deckActions = {
  card: async (id: number, deckId: number): Promise<Card> =>
    await request(`card/${id}/deck/${deckId}`, error => {
      console.log('Unable to get card: ', error)
    }),
  search: async (
    query: URLSearchParams,
    deckId: number
  ): Promise<Array<Card>> =>
    await request(
      `/api/v1/search/deck/${deckId}`,

      error => {
        console.log('Unable to get cards: ', error)
      },
      {
        params: query,
      }
    ),
  set: async (
    query: URLSearchParams,
    id: number,
    deckId: number
  ): Promise<Array<CardSet>> =>
    await request(
      `/api/v1/sets/${id}/deck/${deckId}`,
      error => {
        console.log('Unable to get cards: ', error)
      },
      {
        params: query,
      }
    ),
  collection: async (
    query: URLSearchParams,
    id: number,
    deckId: number
  ): Promise<void> =>
    await request(
      `/api/v1/collection/set/${id}/deck/${deckId}`,

      error => {
        console.log('Unable to get cards from collection', error)
      },
      {
        params: query,
      }
    ),
  deck: async (query: URLSearchParams, id: number): Promise<Array<Card>> =>
    await request(
      `/api/v1/decked_cards/${id}`,

      error => {
        console.log('Unable to get cards: ', error)
      },
      {
        params: query,
      }
    ),
  add: async (id: number, deckId: number, options: any = {}): Promise<Card> =>
    await request(
      `/api/v1/add_decked_card/${deckId}/${id}`,
      error => {
        console.log('Unable to add card to deck', error)
      },
      {
        method: 'post',
        ...options,
      }
    ),
  update: async (
    id: number,
    quantity: number,
    deckId: number,
    options: any = {}
  ): Promise<Card> =>
    await request(
      `/api/v1/add_decked_card/${deckId}/${id}?quantity=${quantity}`,
      error => {
        console.log('Unable to remove card to collection', error)
      },
      {
        method: 'put',
        ...options,
      }
    ),
  remove: async (
    id: number,
    deckId: number,
    options: any = {}
  ): Promise<Card> =>
    await request(
      `/api/v1/remove_decked_card/${deckId}/${id}`,
      error => {
        console.log('Unable to remove card to collection', error)
      },
      {
        method: 'delete',
        ...options,
      }
    ),
}

/**
 * Contains all API calls related to sets
 */
export const setActions = {
  deck: async (id: number, deckId: number): Promise<Array<Card> | Card> =>
    await request(
      `/api/v1/sets/${id}/deck/${deckId}`,

      error => {
        console.log('Unable to get cards: ', error)
      }
    ),
}
