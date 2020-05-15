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
    collection: () => {},
    deck: () => {},
  },
}

const { collection, deck, set } = cardActions

collection.get = async () => {
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
}

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

set.collection = async id => {
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
}
set.deck = async (id, deckId) => {
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
}
