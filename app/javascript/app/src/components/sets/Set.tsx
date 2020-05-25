import React, { useState, useEffect } from 'react'
import { Text } from 'warlock-ui'
import { Cards } from '../cards'
import { useCards } from '../../utils'
import { StatusBar } from '../statusBar'
import { Page } from '../page'

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
    const newCards = await set.deck(id, deck.id)
    setCards(newCards)
  }

  const getCollectionCards = async () => {
    const newCards = await set.collection(id)
    setCards(newCards)
  }

  useEffect(() => {
    getCollectionCards()
  }, [])

  useEffect(() => {
    if (scope.currentScope !== 'collection' && deck && deck.id) {
      setCards([])
      getDeckCards()
    } else {
      setCards([])
      getCollectionCards()
    }
  }, [scope.currentScope])

  return (
    <Page>
      <Text
        size={10}
        style={{
          textTransform: 'uppercase',
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
    </Page>
  )
}
