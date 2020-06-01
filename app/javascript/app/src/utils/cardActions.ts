import axios from 'axios'

export const cardActions = {
  collection: {
    get: () => async () => {
      try {
        const response = await axios('/api/v1/collection')

        const { data } = response

        if (data.error) {
          throw new Error(data.error)
        }

        return data
      } catch (error) {
        console.log('Unable to get cards: ', error)
      }
    },
    add: () => async (id: number) => {
      try {
        const response = await axios.post(`/api/v1/add_card/${id}`)

        const { data } = response

        if (data.error) {
          throw new Error(data.error)
        }

        return data
      } catch (error) {
        console.log('Unable to add card to collection', error)
      }
    },
    update: () => async (id: number, quantity: number) => {
      try {
        const response = await axios.put(
          `/api/v1/add_card/${id}?quantity=${quantity}`
        )

        const { data } = response

        if (data.error) {
          throw new Error(data.error)
        }

        return data
      } catch (error) {
        console.log('Unable to update card collection quantity', error)
      }
    },
    remove: () => async (id: number) => {
      try {
        const response = await axios.delete(`/api/v1/remove_card/${id}`)

        const { data } = response

        if (data.error) {
          throw new Error(data.error)
        }

        return data
      } catch (error) {
        console.log('Unable to remove card to collection', error)
      }
    },
  },
  deck: {
    get: () => async (id: number) => {
      try {
        const response = await axios(`/api/v1/decked_cards/${id}`)

        const { data } = response

        if (data.error) {
          throw new Error(data.error)
        }

        return data
      } catch (error) {
        console.log('Unable to get cards: ', error)
      }
    },
    add: () => async (id: number, deckId: number) => {
      try {
        const response = await axios.post(
          `/api/v1/add_decked_card/${deckId}/${id}`
        )

        const { data } = response

        if (data.error) {
          throw new Error(data.error)
        }

        return data
      } catch (error) {
        console.log('Unable to add card to deck', error)
      }
    },
    update: () => async (id: number, quantity: number, deckId: number) => {
      try {
        const response = await axios.put(
          `/api/v1/add_decked_card/${deckId}/${id}?quantity=${quantity}`
        )

        const { data } = response

        if (data.error) {
          throw new Error(data.error)
        }

        return data
      } catch (error) {
        console.log('Unable to remove card to collection', error)
      }
    },
    remove: () => async (id: number, deckId: number) => {
      try {
        const response = await axios.delete(
          `/api/v1/remove_decked_card/${deckId}/${id}`
        )

        const { data } = response

        if (data.error) {
          throw new Error(data.error)
        }

        return data
      } catch (error) {
        console.log('Unable to remove card to collection', error)
      }
    },
  },
  set: {
    collection: () => async (id: number) => {
      try {
        const response = await axios(`/api/v1/sets/${id}/collection`)

        const { data } = response

        if (data.error) {
          throw new Error(data.error)
        }

        return data
      } catch (error) {
        console.log('Unable to get cards: ', error)
      }
    },
    deck: () => async (id: number, deckId: number) => {
      try {
        const response = await axios(`/api/v1/sets/${id}/deck/${deckId}`)

        const { data } = response

        if (data.error) {
          throw new Error(data.error)
        }

        return data
      } catch (error) {
        console.log('Unable to get cards: ', error)
      }
    },
  },
}

// TODO add better error handling!
