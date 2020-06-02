import { useState } from 'react'
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
  (id?: number, deckId?: number): Promise<Array<Card>>
}

interface Add {
  (id: number, deckId?: number): Promise<Card>
}

interface Update {
  (id: number, quantity: number, deckId?: number): Promise<Card>
}

interface Remove {
  (id: number, deckId?: number): Promise<Card>
}

interface CollectionFunc {
  (id: number): Promise<Array<Card> | Card>
}

interface DeckFunc {
  (id: number, deckId: number): Promise<Array<Card> | Card>
}

interface Set {
  collection: CollectionFunc
  deck: DeckFunc
}

interface CardActionFunc {
  set: Set
  get: Get
  add: Add
  update: Update
  remove: Remove
}

interface Actions {
  actions: CardActionFunc
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

  const actions = {
    ...cardActions[currentScope === 'collection' ? 'collection' : 'deck'],
    set: cardActions.set,
  }

  return {
    actions,
    deck,
    scope: { currentScope, updateScope },
  }
}
