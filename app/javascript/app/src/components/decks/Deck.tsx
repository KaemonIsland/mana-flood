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

    setCards(cards.filter(card => card.id !== cardId))
  }

  const updateCard = async (cardId, newQuantity) => {
    const updatedCard = await update(cardId, newQuantity, id)

    const otherCards = cards.filter(card => card.id !== updatedCard.id)

    setCards([...otherCards, updatedCard])
  }

  const getDeckCards = async () => {
    const cards = await get(id)
    setCards(cards)
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
