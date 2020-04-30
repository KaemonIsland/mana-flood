import axios from 'axios'

export const cardActions = {
  collection: {
    get: () => {},
    add: () => {},
    update: () => {},
    remove: () => {},
  },
  deck: {
    get: () => {},
    add: () => {},
    update: () => {},
    remove: () => {},
  },
  set: {
    getCollection: () => {},
    getDeck: () => {},
  },
}

const { collection, deck, set } = cardActions

collection.get = async () => {}

collection.add = async id => {
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
}

collection.remove = async id => {
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
}

collection.update = async (id, quantity) => {
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
}

deck.get = async id => {
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
}

deck.add = async (id, deckId) => {
  try {
    const response = await axios.post(`/api/v1/add_decked_card/${deckId}/${id}`)

    const { data } = response

    if (data.error) {
      throw new Error(data.error)
    }

    return data
  } catch (error) {
    console.log('Unable to add card to deck', error)
  }
}

deck.update = async (id, quantity, deckId) => {
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
}

deck.remove = async (id, deckId) => {
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
}

set.getCollection = async () => {}
set.getDeck = async () => {}
