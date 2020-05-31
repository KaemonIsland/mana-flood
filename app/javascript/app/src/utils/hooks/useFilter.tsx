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

  const filterCards = () => {
    let newlyFilteredCards = [...cards]

    // Removes promo/alternative cards from general results unless it's within a collection or deck
    newlyFilteredCards = newlyFilteredCards.filter(
      card =>
        !(card.is_promo || card.is_alternative) ||
        (card.deck && card.deck.has_card) ||
        (card.collection && card.collection.has_card)
    )

    // Removes land from results unless specified
    newlyFilteredCards = newlyFilteredCards.filter(
      card => type === 'land' || !card.card_type.includes('Land')
    )

    // Filters cards by color
    if (color.length !== 0) {
      newlyFilteredCards = newlyFilteredCards.filter(card => {
        if (card.color_identity.length === 0 && color.includes('C')) {
          return true
        }

        if (color.includes('M')) {
          return (
            card.color_identity.length >= 2 &&
            card.color_identity.some(cardColor => color.includes(cardColor))
          )
        }
        return card.color_identity.some(cardColor => color.includes(cardColor))
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
