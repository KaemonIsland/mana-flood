import axios from 'axios'
import { Card, CardSet } from '../interface'
import { toCamelcase } from '../utils'

export const cardActions = {
  collection: {
    search: async (query: URLSearchParams): Promise<Array<Card>> => {
      try {
        const response = await axios('/api/v1/search', {
          params: query,
        })

        const { data } = response

        if (data.error) {
          throw new Error(data.error)
        }

        return toCamelcase(data)
      } catch (error) {
        console.log('Unable to get cards: ', error)
      }
    },
    sets: async (): Promise<Array<CardSet>> => {
      try {
        const response = await axios('/api/v1/collection')

        const { data } = response

        if (data.error) {
          throw new Error(data.error)
        }

        return toCamelcase(data)
      } catch (error) {
        console.log('Unable to get cards: ', error)
      }
    },
    collection: async (query: URLSearchParams, id: number): Promise<void> => {
      try {
        // const response = await axios(
        //   `/api/v1/collection/set/${id}/deck/${deck.id}`
        // )
        const response = await axios(`/api/v1/collection/set/${id}`, {
          params: query,
        })

        const { data } = response

        if (data.error) {
          throw new Error(data.error)
        }

        return toCamelcase(data)
      } catch (error) {
        console.log('Unable to get cards from collection', error)
      }
    },
    set: async (query: URLSearchParams, id: number): Promise<void> => {
      try {
        const response = await axios(`/api/v1/sets/${id}/collection`, {
          params: query,
        })

        const { data } = response

        if (data.error) {
          throw new Error(data.error)
        }

        return toCamelcase(data)
      } catch (error) {
        console.log('Unable to get cards from collection', error)
      }
    },
    add: async (id: number): Promise<Card> => {
      try {
        const response = await axios.post(`/api/v1/add_card/${id}`)

        const { data } = response

        if (data.error) {
          throw new Error(data.error)
        }

        return toCamelcase(data)
      } catch (error) {
        console.log('Unable to add card to collection', error)
      }
    },
    update: async (id: number, quantity: number): Promise<Card> => {
      try {
        const response = await axios.put(
          `/api/v1/add_card/${id}?quantity=${quantity}`
        )

        const { data } = response

        if (data.error) {
          throw new Error(data.error)
        }

        return toCamelcase(data)
      } catch (error) {
        console.log('Unable to update card collection quantity', error)
      }
    },
    remove: async (id: number): Promise<Card> => {
      try {
        const response = await axios.delete(`/api/v1/remove_card/${id}`)

        const { data } = response

        if (data.error) {
          throw new Error(data.error)
        }

        return toCamelcase(data)
      } catch (error) {
        console.log('Unable to remove card to collection', error)
      }
    },
  },
  deck: {
    set: async (
      query: URLSearchParams,
      id: number,
      deckId: number
    ): Promise<Array<CardSet>> => {
      try {
        const response = await axios(`/api/v1/sets/${id}/deck/${deckId}`, {
          params: query,
        })

        const { data } = response

        if (data.error) {
          throw new Error(data.error)
        }

        return toCamelcase(data)
      } catch (error) {
        console.log('Unable to get cards: ', error)
      }
    },
    collection: async (
      query: URLSearchParams,
      id: number,
      deckId: number
    ): Promise<void> => {
      try {
        const response = await axios(
          `/api/v1/collection/set/${id}/deck/${deckId}`,
          {
            params: query,
          }
        )

        const { data } = response

        if (data.error) {
          throw new Error(data.error)
        }

        return toCamelcase(data)
      } catch (error) {
        console.log('Unable to get cards from collection', error)
      }
    },
    deck: async (query: URLSearchParams, id: number): Promise<Array<Card>> => {
      try {
        const response = await axios(`/api/v1/decked_cards/${id}`, {
          params: query,
        })

        const { data } = response

        if (data.error) {
          throw new Error(data.error)
        }

        return toCamelcase(data)
      } catch (error) {
        console.log('Unable to get cards: ', error)
      }
    },
    add: async (id: number, deckId: number): Promise<Card> => {
      try {
        const response = await axios.post(
          `/api/v1/add_decked_card/${deckId}/${id}`
        )

        const { data } = response

        if (data.error) {
          throw new Error(data.error)
        }

        return toCamelcase(data)
      } catch (error) {
        console.log('Unable to add card to deck', error)
      }
    },
    update: async (
      id: number,
      quantity: number,
      deckId: number
    ): Promise<Card> => {
      try {
        const response = await axios.put(
          `/api/v1/add_decked_card/${deckId}/${id}?quantity=${quantity}`
        )

        const { data } = response

        if (data.error) {
          throw new Error(data.error)
        }

        return toCamelcase(data)
      } catch (error) {
        console.log('Unable to remove card to collection', error)
      }
    },
    remove: async (id: number, deckId: number): Promise<Card> => {
      try {
        const response = await axios.delete(
          `/api/v1/remove_decked_card/${deckId}/${id}`
        )

        const { data } = response

        if (data.error) {
          throw new Error(data.error)
        }

        return toCamelcase(data)
      } catch (error) {
        console.log('Unable to remove card to collection', error)
      }
    },
  },
  set: {
    deck: async (id: number, deckId: number): Promise<Array<Card> | Card> => {
      try {
        const response = await axios(`/api/v1/sets/${id}/deck/${deckId}`)

        const { data } = response

        if (data.error) {
          throw new Error(data.error)
        }

        return toCamelcase(data)
      } catch (error) {
        console.log('Unable to get cards: ', error)
      }
    },
  },
}
