import React, { useState, useEffect } from 'react'
import { ThemeProvider, Text } from 'warlock-ui'
import { Cards } from '../cards/Cards'
import { useCards } from '../../utils'
import { StatusBar } from '../statusBar'

export const Collection: React.FC = () => {
  const { actions, scope, deck } = useCards('collection')
  const [cards, setCards] = useState([])
  const { get, add, update, remove } = actions

  const sortCards = cards => filterVariation(cards).sort(sortAlpha)

  const addCard = async cardId => {
    const newCard = await add(cardId, deck && deck.id)

    const withoutCard = cards.filter(card => card.id !== cardId)

    setCards(sortCards([...withoutCard, newCard]))
  }

  const removeCard = async cardId => {
    const newCard = await remove(cardId, deck && deck.id)

    const withoutCard = cards.filter(card => card.id !== cardId)

    setCards(sortCards([...withoutCard, newCard]))
  }

  const updateCard = async (cardId, newQuantity) => {
    const updatedCard = await update(cardId, newQuantity, deck && deck.id)

    const otherCards = cards.filter(card => card.id !== updatedCard.id)

    setCards(sortCards([...otherCards, updatedCard]))
  }

  const getCollectionCards = async () => {
    const cards = await get()
    setCards(sortCards(cards))
  }

  const getCollectionCardsWithDeck = async () => {
    fetch(`/api/v1/collection/deck/${deck.id}`, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(cardsData => setCards(sortCards(cardsData)))
      .catch(error => console.log('Unable to get cards: ', error))
  }

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
      <Cards actions={{ addCard, updateCard, removeCard }} cards={cards} />
      <hr />
      <StatusBar scope={scope} />
    </ThemeProvider>
  )
}
