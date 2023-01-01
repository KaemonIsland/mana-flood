import { collectionCardActions, deckCardActions } from '../utils/cardActions'
import { Card } from '../interface'

interface Add {
  (id: number, deckId?: number): Promise<Card>
}

interface Update {
  (id: number, quantity: number, deckId?: number): Promise<Card>
}

interface Remove {
  (id: number, deckId?: number): Promise<Card>
}

interface CardActionFunc {
  add: Add
  update: Update
  remove: Remove
}

interface Actions {
  actions: CardActionFunc
}

/**
 * Contains crud functionality for the Card component.
 * This makes it a lot easier to dynamically set where we update
 * card information for User Decks.
 */
export const useCardActions = (): Actions => {
  // Adds a new card to a deck or to the users collection
  const addCard = async (id: number, options?: any): Promise<Card> => {
    if (options && options.deckId) {
      return await deckCardActions.add(id, options.deckId, options)
    }
    return await collectionCardActions.add(id, options)
  }

  // Removes a card from a deck or a users collection
  const removeCard = async (id: number, options?: any): Promise<Card> => {
    if (options && options.deckId) {
      await deckCardActions.remove(id, options.deckId, options)
    }

    return await collectionCardActions.remove(id, options)
  }

  // Updates the number of cards in a deck or collection
  const updateCard = async (
    id: number,
    quantity: number,
    options?: any
  ): Promise<Card> => {
    if (options && options.deckId) {
      return await deckCardActions.update(id, quantity, options.deckId, options)
    }
    return await collectionCardActions.update(id, quantity, options)
  }

  return {
    actions: {
      add: addCard,
      update: updateCard,
      remove: removeCard,
    },
  }
}
