import React, { useState, useEffect } from 'react'
import { ThemeProvider } from 'warlock-ui'
import { Cards } from '../cards'
import { useCards } from '../../utils'
import { Stats } from './Stats'

export const Deck = ({ name, format, updated_at, id }) => {
  const [cards, setCards] = useState([])
  const { actions } = useCards(name)

  // Card Crud actions

  const { get, add, update, remove } = actions

  const addCard = cardId => add(cardId, id)

  const removeCard = async cardId => {
    remove(cardId, id)

    setCards(sortCards(cards.filter(card => card.id !== cardId)))
  }

  const updateCard = async (cardId, newQuantity) => {
    const updatedCard = await update(cardId, newQuantity, id)

    const otherCards = cards.filter(card => card.id !== updatedCard.id)

    setCards(sortCards([...otherCards, updatedCard]))
  }

  // Card Sorting

  const sortAlpha = (a, b) => {
    const cardA = a.name.toUpperCase()
    const cardB = b.name.toUpperCase()

    if (cardA > cardB) {
      return 1
    } else if (cardB > cardA) {
      return -1
    } else {
      return 0
    }
  }

  // Filters out variations
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

  const sortCards = cards => filterVariation(cards).sort(sortAlpha)

  const getDeckCards = async () => {
    const cards = await get(id)
    setCards(sortCards(cards))
  }

  useEffect(() => {
    getDeckCards()
  }, [])

  return (
    <ThemeProvider>
      <Stats name={name} format={format} cards={cards} />
      <Cards
        actions={{ addCard, updateCard, removeCard }}
        cards={cards}
        scope="deck"
      />
    </ThemeProvider>
  )
}
