import React, { useState, useEffect } from 'react'
import { cardActions } from '../cardActions'

/**
 * Contains crud functionality for the Card component.
 * This makes it a lot easier to dynamically set where we update
 * card information for User Collection or Sets.
 */
export const useCards = defaultScope => {
  const [currentScope, setCurrentScope] = useState(defaultScope || 'collection')
  const [deck, setDeck] = useState({})

  const updateScope = (name, deckInfo = {}) => {
    setCurrentScope(name)
    name !== 'collection' ? setDeck(deckInfo) : setDeck({})
  }

  const actions =
    cardActions[currentScope === 'collection' ? 'collection' : 'deck']

  return {
    actions,
    deck,
    scope: { currentScope, updateScope },
  }
}
