import React, { useState, useEffect } from 'react'
import { cardActions } from '../cardActions'

/**
 * Contains crud functionality for the Card component.
 * This makes it a lot easier to dynamically set where we update
 * card information for User Collection or Sets.
 */
export const useCards = defaultContainer => {
  const [container, setContainer] = useState(defaultContainer || 'collection')
  const [deck, setDeck] = useState({})

  const updateContainer = (name, deckInfo = {}) => {
    setContainer(name)
    if (name === 'deck') {
      setDeck(deckInfo)
    } else {
      setDeck({})
    }
  }

  const actions =
    cardActions[container === 'collection' ? 'collection' : 'deck']
  return {
    actions,
    deck,
    container,
    updateContainer,
  }
}
