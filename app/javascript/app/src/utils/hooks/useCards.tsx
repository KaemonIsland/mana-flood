import { useState, useEffect } from 'react'
import { cardActions } from '../cardActions'
import { Deck, Card, CardStats } from '../../interface'

interface Get {
  (query?: {}): Promise<void>
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

interface Options {
  setId?: number
  query?: URLSearchParams
  deckId?: number
}

interface Actions {
  actions: CardActionFunc
  cards: Array<Card>
  pagination: PaginationProps
  stats: CardStats
  isLoading: boolean
}

const defaultStats = {
  colors: {
    total: 0,
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
export const useCards = (
  type: string,
  scope: Deck | string,
  options: Options = {}
): Actions => {
  const [isLoading, setIsLoading] = useState(true)
  const [cards, setCards] = useState([])
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 })
  const [stats, setStats] = useState(defaultStats)
  const [query, setQuery] = useState(options?.query || new URLSearchParams())

  const deckId = (typeof scope !== 'string' && scope.id) || null

  const actionScope = typeof scope === 'string' ? 'collection' : 'deck'

  const addCard = async (id: number): Promise<Card> =>
    await cardActions[actionScope].add(id, deckId)

  const removeCard = async (id: number): Promise<Card> =>
    await cardActions[actionScope].remove(id, deckId)

  const updateCard = async (id: number, quantity: number): Promise<Card> =>
    await cardActions[actionScope].update(id, quantity, deckId)

  const getCards = async (cardQuery = new URLSearchParams()): Promise<void> => {
    if (!cardQuery.has('page')) {
      cardQuery.append('page', '1')
    }

    cardQuery.set('per_page', '30')

    setQuery(cardQuery)

    let response

    if (type === 'search') {
      response = await cardActions[actionScope][type](cardQuery, deckId)
    } else if (typeof scope === 'object' || options.deckId) {
      if (type === 'deck') {
        response = await cardActions.deck.deck(cardQuery, deckId)
      } else {
        response = await cardActions.deck[type](
          cardQuery,
          options.setId,
          deckId
        )
      }
    } else {
      response = await cardActions.collection[type](cardQuery, options.setId)
    }

    setIsLoading(false)

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
    if (isLoading) {
      getCards(options.query)
    }
  }, [isLoading])

  useEffect(() => {
    setIsLoading(true)
  }, [options.query])

  useEffect(() => {
    setCards([])
    setIsLoading(true)
  }, [scope])

  return {
    isLoading,
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
    stats,
  }
}
