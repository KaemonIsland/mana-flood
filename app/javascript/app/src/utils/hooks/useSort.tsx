import React, { useEffect, useState } from 'react'

// Sorts by card name alphabetically
const sortAlpha = (a, b) => {
  const cardA = a.name.toLowerCase()
  const cardB = b.name.toLowerCase()

  if (cardA > cardB) {
    return 1
  } else if (cardB > cardA) {
    return -1
  } else {
    return 0
  }
}

// Sorts cards by converted mana cost smallest to largest
const sortCmc = (a, b) => {
  const cardA = Number(a.converted_mana_cost)
  const cardB = Number(b.converted_mana_cost)

  return cardA - cardB
}

export const useSort = cards => {
  const [sortedCards, setSortedCards] = useState([])

  const sortByColor = () => {
    const cardsByColor = {
      W: [],
      U: [],
      B: [],
      R: [],
      G: [],
      M: [],
      C: [],
    }
    cards
      .sort(sortAlpha)
      .sort(sortCmc)
      .forEach(card => {
        const { color_identity } = card

        if (color_identity.length === 0) {
          cardsByColor.C.push(card)
        } else if (color_identity.length === 1) {
          cardsByColor[color_identity[0]].push(card)
        } else {
          cardsByColor.M.push(card)
        }
      })

    return Object.values(cardsByColor).flat()
  }

  useEffect(() => {
    setSortedCards(sortByColor())
  }, [cards])

  return sortedCards
}
