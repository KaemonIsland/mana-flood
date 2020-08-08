import { useState, useEffect } from 'react'
import { cardActions } from '../cardActions'
import { Deck, Card, CardStats } from '../../interface'

const defaultDeck = {
  id: 0,
}

interface Scope {
  currentScope: string
  updateScope
}

interface Get {
  (id: number, query?: {}): Promise<Array<Card>>
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

interface CardActionFunc {
  get: Get
  add: Add
  update: Update
  remove: Remove
}

interface PaginationProps {
  page: number
  perPage?: number
  total?: number
  totalPages: number
  changePage: any
}

interface Actions {
  actions: CardActionFunc
  deck: Deck
  cards: Array<Card> | Array<[]>
  pagination: PaginationProps
  stats: CardStats
}

const defaultStats = {
  colors: {
    W: 0,
    U: 0,
    B: 0,
    R: 0,
    G: 0,
    C: 0,
    M: 0,
  },
  types: {
    creature: { count: 0, subtypes: {} },
    enchantment: { count: 0, subtypes: {} },
    instant: { count: 0, subtypes: {} },
    land: { count: 0, subtypes: {} },
    sorcery: { count: 0, subtypes: {} },
    planeswalker: { count: 0, subtypes: {} },
    artifact: { count: 0, subtypes: {} },
  },
  cmc: {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
  },
  counts: {
    creature: 0,
    nonCreature: 0,
    land: 0,
    nonLand: 0,
  },
  rarity: {
    common: 0,
    uncommon: 0,
    rare: 0,
    mythic: 0,
  },
  cards: 0,
}

/**
 * Contains crud functionality for the Card component.
 * This makes it a lot easier to dynamically set where we update
 * card information for User Collection or Sets.
 */
export const useCards = (scope = 'collection', options = {}): Actions => {
  const [cards, setCards] = useState([])
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 })
  const [stats, setStats] = useState(defaultStats)
  const [query, setQuery] = useState(new URLSearchParams())
  const [currentScope, setCurrentScope] = useState(scope)
  const [deck, setDeck] = useState(defaultDeck)

  const updateScope = (name: string, deckInfo: Deck): void => {
    setCurrentScope(name)
    name !== 'collection' ? setDeck(deckInfo) : setDeck(defaultDeck)
  }

  const addCard = async (id: number): Promise<Card> =>
    await cardActions[scope].add(id)

  const removeCard = async (id: number): Promise<Card> =>
    await cardActions[scope].remove(id)

  const updateCard = async (id: number, quantity: number): Promise<Card> =>
    await cardActions[scope].update(id, quantity)

  const getCards = async (cardQuery = new URLSearchParams()): Promise<void> => {
    if (!cardQuery.has('page')) {
      cardQuery.append('page', '1')
    }

    cardQuery.set('per_page', '30')

    setQuery(cardQuery)

    let response

    if (options?.setType === 'full') {
      response = await cardActions[scope].all(options.id, cardQuery)
    } else {
      response = await cardActions[scope].owned(options.id, cardQuery)
    }

    setCards(response.cards)
    setPagination(response.pagination)
    setStats(response.stats)
  }

  const changePage = (newPage: number): void => {
    const newQuery = new URLSearchParams(query.toString())

    newQuery.set('page', String(newPage))

    getCards(newQuery)
  }

  useEffect(() => {
    getCards()
  }, [])

  return {
    actions: {
      get: getCards,
      add: addCard,
      update: updateCard,
      remove: removeCard,
    },
    cards,
    pagination: {
      ...pagination,
      changePage,
    },
    deck,
    stats,
  }
}
