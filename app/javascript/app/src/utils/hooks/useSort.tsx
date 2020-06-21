import { useEffect, useState } from 'react'

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
  const cardA = Number(a.convertedManaCost)
  const cardB = Number(b.convertedManaCost)

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
        const { colorIdentity } = card

        if (colorIdentity.length === 0) {
          cardsByColor.C.push(card)
        } else if (colorIdentity.length === 1) {
          cardsByColor[colorIdentity[0]].push(card)
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
