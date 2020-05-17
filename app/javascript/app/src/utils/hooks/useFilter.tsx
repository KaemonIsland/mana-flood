import React, { useState, useEffect } from 'react'

export const useFilter = cards => {
  let filteredCards = [...cards]
  const [filters, setFilters] = useState({
    color: [],
    rarity: [],
    type: [],
    cmc: null,
  })

  const { color, type, rarity, cmc } = filters

  const updateFilters = ({ target }) => {
    const { name, value } = target

    const filter = filters[name]

    if (filter.includes(value)) {
      setFilters({ ...filters, [name]: filter.filter(val => val !== value) })
    } else {
      setFilters({ ...filters, [name]: [...filter, value] })
    }
  }

  if (color.length !== 0) {
    filteredCards = filteredCards.filter(card => {
      if (card.colors.length === 0 && color.includes('C')) {
        return true
      }
      return card.colors.some(cardColor => color.includes(cardColor))
    })
  }

  return {
    filteredCards,
    filters,
    updateFilters,
  }
}
