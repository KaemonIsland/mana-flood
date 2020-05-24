import React, { useState, useEffect } from 'react'
import { ThemeProvider, Text } from 'warlock-ui'
import { Cards } from '../cards/Cards'
import { useCards } from '../../utils'
import { StatusBar } from '../statusBar'

export const Collection: React.FC = () => {
  const { actions, scope, deck } = useCards('collection')
  const [cards, setCards] = useState([])
  const { get, add, update, remove } = actions

  const addCard = async cardId => {
    const newCard = await add(cardId, deck && deck.id)

    const withoutCard = cards.filter(card => card.id !== cardId)

    setCards([...withoutCard, newCard])
  }

  const removeCard = async cardId => {
    const newCard = await remove(cardId, deck && deck.id)

    const withoutCard = cards.filter(card => card.id !== cardId)

    setCards([...withoutCard, newCard])
  }

  const updateCard = async (cardId, newQuantity) => {
    const updatedCard = await update(cardId, newQuantity, deck && deck.id)

    const otherCards = cards.filter(card => card.id !== updatedCard.id)

    setCards([...otherCards, updatedCard])
  }

  const getCollectionCards = async () => {
    const cards = await get()
    setCards(cards)
  }

  const getCollectionCardsWithDeck = async () => {
    fetch(`/api/v1/collection/deck/${deck.id}`, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(cardsData => setCards(cardsData))
      .catch(error => console.log('Unable to get cards: ', error))
  }

  useEffect(() => {
    getCollectionCards()
  }, [])

  useEffect(() => {
    if (scope.currentScope !== 'collection' && deck && deck.id) {
      setCards([])
      getCollectionCardsWithDeck()
    }
  }, [scope.currentScope])
  return (
    <ThemeProvider>
      <Text size={10}>My Collection</Text>
      <hr />
      <Text>{cards.length} different cards</Text>
      <Cards
        actions={{ addCard, updateCard, removeCard }}
        cards={cards}
        scope="collection"
      />
      <hr />
      <StatusBar scope={scope} />
    </ThemeProvider>
  )
}
