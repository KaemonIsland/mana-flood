import React, { useState, useEffect } from 'react'

export const useFilter = cards => {
  const [filteredCards, setFilteredCards] = useState([])
  const [filters, setFilters] = useState({
    color: [],
    rarity: [],
    type: null,
    cmc: {
      min: 0,
      max: 20,
    },
  })

  const { color, type, rarity } = filters
  const { min, max } = filters.cmc

  /**
   * Updates an array of options, either adding a new item to the array, or removing it.
   *
   * @param {string} name - category of the filter
   * @param {string} value - value to add/remove from filter category
   */
  const updateMultiple = ({ name, value }) => {
    const filter = filters[name]

    if (value === 'all') {
      setFilters({ ...filters, [name]: [] })
    } else if (filter.includes(value)) {
      setFilters({
        ...filters,
        [name]: filter.filter(val => val !== value),
      })
    } else {
      setFilters({ ...filters, [name]: [...filter, value] })
    }
  }

  /**
   * Updates a single value to the new value
   *
   * @param {string} name - category of the filter
   * @param {string} value - value to add/remove from filter category
   */
  const updateSingle = ({ name, value }) => {
    if (value === 'all') {
      setFilters({ ...filters, [name]: null })
    } else {
      setFilters({ ...filters, [name]: value })
    }
  }

  /**
   * Updates a range of values, these include a min/max value
   *
   * @param {string} name - category of the filter
   * @param {string} value - value to add/remove from filter category
   */
  const updateRange = ({ name, value }) => {
    setFilters({
      ...filters,
      cmc: { ...filters.cmc, [name]: value },
    })
  }

  /**
   * Decides how to update our various filter
   *
   * @param {object} target - value form form element
   */
  const updateFilters = ({ target }) => {
    const { name } = target

    if (name === 'color' || name === 'rarity') {
      updateMultiple(target)
    } else if (name === 'type') {
      updateSingle(target)
    } else if (name === 'min' || name === 'max') {
      updateRange(target)
    }
  }

  // Removes card variations to prevent multiples from being listed
  const filterVariation = cards => {
    let variants = []

    const filteredCards = cards.filter(card => {
      if (card.variations) {
        card.variations.forEach(variant => variants.push(variant))
      }

      return !variants.includes(card.uuid)
    })

    return filteredCards
  }

  const filterCards = () => {
    let newlyFilteredCards = filterVariation(cards)

    // Filters cards by color
    if (color.length !== 0) {
      newlyFilteredCards = newlyFilteredCards.filter(card => {
        if (card.colors.length === 0 && color.includes('C')) {
          return true
        }
        return card.colors.some(cardColor => color.includes(cardColor))
      })
    }

    // Filters cards by rarity
    if (rarity.length !== 0) {
      newlyFilteredCards = newlyFilteredCards.filter(card =>
        rarity.some(rare => card.rarity === rare)
      )
    }

    // Filters cards by type
    if (type) {
      newlyFilteredCards = newlyFilteredCards.filter(card =>
        JSON.parse(card.card_types).some(cardType =>
          type.includes(cardType.toLowerCase())
        )
      )
    }

    // Filters cards by minimum converted mana cost
    if (min) {
      newlyFilteredCards = newlyFilteredCards.filter(
        card => card.converted_mana_cost >= min
      )
    }

    // Filters cards by maximum converted mana cost
    if (max) {
      newlyFilteredCards = newlyFilteredCards.filter(
        card => card.converted_mana_cost <= max
      )
    }

    setFilteredCards(newlyFilteredCards)
  }

  useEffect(() => {
    filterCards()
  }, [cards, filters])

  return {
    filteredCards,
    filters,
    updateFilters,
  }
}
