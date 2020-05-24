import React, { useState, useEffect } from 'react'
import { ThemeProvider, Flex, Text } from 'warlock-ui'
import { Cards } from '../cards'
import { useCards } from '../../utils'
import { StatusBar } from '../statusBar'

export const Set = ({
  id,
  name,
  code,
  release_date,
  set_type,
  base_set_size,
}) => {
  const [cards, setCards] = useState([])
  const { actions, scope, deck } = useCards('collection')
  const { add, update, remove, set } = actions

  const addCard = async cardId => await add(cardId, deck && deck.id)

  const removeCard = async cardId => await remove(cardId, deck && deck.id)

  const updateCard = async (cardId, newQuantity) =>
    await update(cardId, newQuantity, deck && deck.id)

  const getDeckCards = async () => {
    const cards = await set.deck(id, deck.id)
    setCards(cards)
  }

  const getCollectionCards = async () => {
    const cards = await set.collection(id)
    setCards(cards)
  }

  useEffect(() => {
    getCollectionCards()
  }, [])

  useEffect(() => {
    if (scope.currentScope !== 'collection' && deck && deck.id) {
      setCards([])
      getDeckCards()
    }
  }, [scope.currentScope])

  return (
    <ThemeProvider>
      <Text
        size={10}
        style={{
          textTransform: 'uppercase',
          textAlign: 'center',
        }}
      >
        {name}
      </Text>
      <hr />
      <Cards
        actions={{ addCard, updateCard, removeCard }}
        cards={cards}
        scope="set"
      />
      <StatusBar scope={scope} />
    </ThemeProvider>
  )
}
