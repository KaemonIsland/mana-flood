import React, { useState, useEffect } from 'react'
import { ThemeProvider, Text } from 'warlock-ui'
import { Cards } from '../cards/Cards'
import { useCards } from '../../utils'
import { StatusBar } from '../statusBar'

export const Collection: React.FC = () => {
  const { actions, scope, deck } = useCards('collection')
  const [cards, setCards] = useState([])
  const { get, add, update, remove } = actions

  const addCard = async cardId => await add(cardId, deck && deck.id)

  const removeCard = async cardId => await remove(cardId, deck && deck.id)

  const updateCard = async (cardId, newQuantity) =>
    await update(cardId, newQuantity, deck && deck.id)

  const getCollectionCards = async () => {
    const newCards = await get()
    setCards(newCards)
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
    setCards([])
    if (scope.currentScope !== 'collection' && deck && deck.id) {
      getCollectionCardsWithDeck()
    } else {
      getCollectionCards()
    }
  }, [scope.currentScope])
  return (
    <ThemeProvider>
      <Text size={10}>My Collection</Text>
      <Text>{cards.length} different cards</Text>
      <hr />
      <Cards
        actions={{ addCard, updateCard, removeCard }}
        cards={cards}
        scope={scope.currentScope}
      />
      <StatusBar scope={scope} />
    </ThemeProvider>
  )
}
