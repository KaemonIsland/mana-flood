import React, { useState, useEffect } from 'react'
import { ThemeProvider, Flex, Text } from 'warlock-ui'
import { formatDate } from '../../utils'
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
  ...rest
}) => {
  const [cards, setCards] = useState([])
  const { actions, scope, deck } = useCards('collection')
  const { add, update, remove, set } = actions

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

  const getDeckCards = async () => {
    const cards = await set.deck(id, deck.id)
    setCards(sortCards(cards))
  }

  const getCollectionCards = async () => {
    const cards = await set.collection(id)
    setCards(sortCards(cards))
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
      <Flex justifyContent="space-around" alignItems="center">
        <Text isBold>{code}</Text>
        <Text isItalics>
          {formatDate(release_date, {
            month: 'long',
            year: 'numeric',
            day: 'numeric',
          })}
        </Text>
        <Text>
          {set_type} - {base_set_size} cards
        </Text>
      </Flex>
      <hr />
      <Cards actions={{ addCard, updateCard, removeCard }} cards={cards} />
      <StatusBar scope={scope} />
    </ThemeProvider>
  )
}
