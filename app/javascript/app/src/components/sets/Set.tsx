import React, { useState, useEffect, ReactElement } from 'react'
import { Text } from 'warlock-ui'
import { Cards } from '../cards'
import { useCards } from '../../utils'
import { Page } from '../page'
import { Card } from '../../interface'

interface SetProps {
  id: number
  name: string
  code: string
  releaseDate: Date
  setType: string
  baseSetSize: number
}

export const Set = ({ id, name }: SetProps): ReactElement => {
  const [cards, setCards] = useState([])
  const { actions, scope, deck } = useCards('collection')
  const { add, update, remove, set } = actions

  const addCard = async (cardId: number): Promise<Card> =>
    await add(cardId, deck && deck.id)

  const removeCard = async (cardId: number): Promise<Card> =>
    await remove(cardId, deck && deck.id)

  const updateCard = async (
    cardId: number,
    newQuantity: number
  ): Promise<Card> => await update(cardId, newQuantity, deck && deck.id)

  const getDeckCards = async (): Promise<void> => {
    const newCards = await set.deck(id, deck.id)
    setCards(newCards)
  }

  const getCollectionCards = async (): Promise<void> => {
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
    </Page>
  )
}
