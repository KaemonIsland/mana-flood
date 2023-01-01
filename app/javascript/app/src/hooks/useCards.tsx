import { useState, useEffect } from 'react'
import { collectionCardActions, deckCardActions } from '../utils/cardActions'
import { Card, CardStats } from '../interface'

interface Get {
  (query?: {}): Promise<void>
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
  isCollection?: boolean
  isDeck?: boolean
}

interface Actions {
  getCards: Get
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
export const useCards = (options: Options = {}): Actions => {
  const [isLoading, setIsLoading] = useState(true)
  const [cards, setCards] = useState([])
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 })
  const [stats, setStats] = useState(defaultStats)
  const [query, setQuery] = useState(options?.query || new URLSearchParams())

  const getCards = async (cardQuery = new URLSearchParams()): Promise<void> => {
    if (!cardQuery.has('page')) {
      cardQuery.append('page', '1')
    }

    cardQuery.set('per_page', '30')

    // Only return front side of MDFCs and Adventures
    cardQuery.append('q[side_not_eq]', 'b')

    setQuery(cardQuery)

    let response
    const { setId, deckId, isDeck } = options

    // Get cards from a set or from a deck
    if (setId || deckId) {
      // Get cards from a set with deck quantities
      if (setId && deckId) {
        response = await deckCardActions.set(
          cardQuery,
          options.setId,
          options.deckId
        )
        // Get cards from a deck
      } else if (deckId && isDeck) {
        response = await deckCardActions.deck(cardQuery, deckId)
        // get cards with deck quantities
      } else if (deckId) {
        response = await deckCardActions.search(cardQuery, deckId)
        // get set cards without deck quantities
      } else if (setId) {
        response = await collectionCardActions.set(cardQuery, setId)
      }
      // Otherwise get cards by collection
    } else {
      response = await collectionCardActions.search(cardQuery)
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

  return {
    isLoading,
    getCards,
    cards,
    pagination: {
      ...pagination,
      changePage,
    },
    stats,
  }
}
