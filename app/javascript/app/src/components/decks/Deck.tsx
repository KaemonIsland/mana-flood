import React, { useState, useEffect, ReactElement } from 'react'
import { Button } from 'warlock-ui'
import { Cards } from '../cards'
import { useCards } from '../../utils'
import { Stats } from './Stats'
import { Page } from '../page'
import { Deck as DeckType, Card } from '../../interface'

export const Deck = ({ name, format, id }: DeckType): ReactElement => {
  const [cards, setCards] = useState([])
  const { actions } = useCards(name)

  // Card Crud actions

  const { get, add, update, remove } = actions

  const addCard = async (cardId: number): Promise<Card> => await add(cardId, id)

  const removeCard = async (cardId: number): Promise<Card> =>
    await remove(cardId, id)

  const updateCard = async (
    cardId: number,
    newQuantity: number
  ): Promise<Card> => await update(cardId, newQuantity, id)

  const getDeckCards = async (): Promise<void> => {
    const cards = await get(id)
    setCards(cards)
  }

  useEffect(() => {
    getDeckCards()
  }, [])

  return (
    <Page>
      <Stats name={name} format={format} cards={cards} />
      <Button onClick={() => {}}>Add Cards +</Button>
      <Cards
        actions={{ addCard, updateCard, removeCard }}
        cards={cards}
        scope="deck"
      />
    </Page>
  )
}
