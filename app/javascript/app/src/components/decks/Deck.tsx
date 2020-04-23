import React, { useState, useEffect } from 'react'
import { ThemeProvider, Text, Flex } from 'warlock-ui'
import { formatDate } from '../../utils'
import { Cards } from '../cards'
import { useCards } from '../../utils'
import { StatusBar } from '../statusBar'

export const Deck = ({ name, format, updated_at, id, ...rest }) => {
  const { actions } = useCards(name)
  const [cards, setCards] = useState([])

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
    fetch(`/api/v1/decked_cards/${id}`, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(cardsData => {
        const noVariants = filterVariation(cardsData)

        const sorted = noVariants.sort(sortAlpha)

        return setCards(sorted)
      })
      .catch(error => console.log('Unable to get cards: ', error))
  }

  useEffect(() => {
    if (cards.length === 0) {
      getDeckCards()
    }
  }, [cards])
  return (
    <ThemeProvider>
      <Flex alignItems="start" direction="column">
        <Text family="roboto" size={8}>
          {name}
        </Text>
        <Text>
          Updated:{' '}
          <Text display="inline-block" isItalics>
            {formatDate(updated_at, {})}
          </Text>
        </Text>
        <Text>{format}</Text>
      </Flex>
      <hr />
      <Cards actions={actions} deck={{ id }} cards={cards} />
    </ThemeProvider>
  )
}
