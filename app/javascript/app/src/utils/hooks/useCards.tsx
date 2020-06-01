import { useState, useEffect } from 'react'
import { cardActions } from '../cardActions'
import { Deck, Card } from '../../interface'

const defaultDeck = {
  id: 0,
}

interface Scope {
  currentScope: string
  updateScope
}

interface Get {
  (id: number, deckId?: number): Array<Card>
}

interface Add {
  (id: number, deckId?: number): Card
}

interface Update {
  (id: number, quantity: number, deckId?: number): Card
}
interface Remove {
  (id: number, deckId?: number): Card
}

interface CardActions {
  get: Get
  add: Add
  update: Update
  remove: Remove
}

interface Actions {
  actions: CardActions
  deck: Deck
  scope: Scope
}

/**
 * Contains crud functionality for the Card component.
 * This makes it a lot easier to dynamically set where we update
 * card information for User Collection or Sets.
 */
export const useCards = (defaultScope = 'collection'): Actions => {
  const [currentScope, setCurrentScope] = useState(defaultScope)
  const [deck, setDeck] = useState(defaultDeck)

  const updateScope = (name: string, deckInfo: Deck): void => {
    setCurrentScope(name)
    name !== 'collection' ? setDeck(deckInfo) : setDeck(defaultDeck)
  }

  const actions =
    cardActions[currentScope === 'collection' ? 'collection' : 'deck']

  actions['set'] = cardActions['set']

  return {
    actions,
    deck,
    scope: { currentScope, updateScope },
  }
}
