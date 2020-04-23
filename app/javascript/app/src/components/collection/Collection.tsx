import React, { useState, useEffect } from 'react'
import { ThemeProvider, Text } from 'warlock-ui'
import { Cards } from '../cards/Cards'
import { useCards } from '../../utils'
import { StatusBar } from '../statusBar'

export const Collection: React.FC = () => {
  const { actions, scope, deck } = useCards('collection')
  const [cards, setCards] = useState([])
  const getCollectionCards = async () => {
    fetch(`/api/v1/collection`, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(cardsData => setCards(cardsData))
      .catch(error => console.log('Unable to get cards: ', error))
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
    if (cards.length === 0) getCollectionCards()
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
      <Cards actions={actions} deck={deck} cards={cards} />
      <hr />
      <StatusBar scope={scope} />
    </ThemeProvider>
  )
}
