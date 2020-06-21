import React, { useState, useEffect, ReactElement } from 'react'
import axios from 'axios'
import { Text } from 'warlock-ui'
import { Cards } from '../cards/Cards'
import { useCards, toCamelcase } from '../../utils'
import { Page } from '../page'
import { Card } from '../../interface'

interface CollectionCardsProps {
  setId: number
}

export const CollectionCards = ({
  setId,
}: CollectionCardsProps): ReactElement => {
  const { actions, scope, deck } = useCards('collection')
  const [cards, setCards] = useState([])
  const { get, add, update, remove } = actions

  const addCard = async (id: number): Promise<Card> =>
    await add(id, deck && deck.id)

  const removeCard = async (id: number): Promise<Card> =>
    await remove(id, deck && deck.id)

  const updateCard = async (id: number, quantity: number): Promise<Card> =>
    await update(id, quantity, deck && deck.id)

  const getCollectionCards = async (): Promise<void> => {
    try {
      const response = await axios(`/api/v1/collection/set/${setId}`)

      const { data } = response

      if (data.error) {
        throw new Error(data.error)
      }

      setCards(toCamelcase(data))
    } catch (error) {
      console.log('Unable to get cards from collection', error)
    }
  }

  const getCollectionCardsWithDeck = async (): Promise<void> => {
    try {
      const response = await axios(
        `/api/v1/collection/set/${setId}/deck/${deck.id}`
      )

      const { data } = response

      if (data.error) {
        throw new Error(data.error)
      }

      setCards(toCamelcase(data))
    } catch (error) {
      console.log('Unable to get collection cards: ', error)
    }
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
    <Page>
      <Text size={10}>My Collection</Text>
      <Text>{cards.length} unique cards</Text>
      <hr />
      <Cards
        actions={{ addCard, updateCard, removeCard }}
        cards={cards}
        scope={scope.currentScope}
      />
    </Page>
  )
}
