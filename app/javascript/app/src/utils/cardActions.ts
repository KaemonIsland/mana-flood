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

collection.add = async (id, callback) => {
  try {
    const response = await axios.post(`/api/v1/add_card/${id}`)

    const { data } = response

    if (data.error) {
      throw new Error(data.error)
    }

    callback(data)
  } catch (error) {
    console.log('Unable to add card to collection', error)
  }
}

collection.remove = async (id, callback) => {
  try {
    const response = await axios.delete(`/api/v1/remove_card/${id}`)

    const { data } = await response

    if (data.error) {
      throw new Error(data.error)
    }

    callback(data)
  } catch (error) {
    console.log('Unable to remove card to collection', error)
  }
}

collection.update = async (id, callback, quantity) => {
  if (quantity === 0) {
    return collection.remove(id, callback)
  }

  try {
    const response = await axios.put(
      `/api/v1/add_card/${id}?quantity=${quantity}`
    )

    const { data } = await response

    if (data.error) {
      throw new Error(data.error)
    }

    callback(data)
  } catch (error) {
    console.log('Unable to update card collection quantity', error)
  }
}

deck.get = async () => {}

deck.add = async (id, callback, deckId) => {
  try {
    const response = await axios.post(`/api/v1/add_decked_card/${deckId}/${id}`)

    const { data } = response

    if (data.error) {
      throw new Error(data.error)
    }

    callback(data)
  } catch (error) {
    console.log('Unable to add card to deck', error)
  }
}

deck.update = async (id, callback, quantity, deckId) => {
  if (quantity === 0) {
    return deck.remove(id, callback)
  }

  try {
    const response = await axios.put(
      `/api/v1/add_decked_card/${deckId}/${id}?quantity=${quantity}`
    )

    const { data } = await response

    if (data.error) {
      throw new Error(data.error)
    }

    callback(data)
  } catch (error) {
    console.log('Unable to remove card to collection', error)
  }
}

deck.remove = async (id, callback, deckId) => {
  try {
    const response = await axios.delete(
      `/api/v1/remove_decked_card/${deckId}/${id}`
    )

    const { data } = await response

    if (data.error) {
      throw new Error(data.error)
    }

    callback(data)
  } catch (error) {
    console.log('Unable to remove card to collection', error)
  }
}

set.getCollection = async () => {}
set.getDeck = async () => {}
