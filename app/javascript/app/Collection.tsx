import React, { useState, useEffect } from 'react'
import { ThemeProvider, Text } from 'warlock-ui'
import { Cards } from './src/components/Cards'

export const Collection: React.FC = () => {
  const [cards, setCards] = useState([])
  const getCollectionCards = async () => {
    fetch(`/api/v1/collection`, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(cardsData => setCards(cardsData))
      .catch(error => console.log('Unable to get cards: ', error))
  }

  useEffect(() => {
    if (cards.length === 0) getCollectionCards()
  }, [])
  return (
    <ThemeProvider>
      <Text size={10}>My Collection</Text>
      <hr />
      <Text>{cards.length} different cards</Text>
      <Cards cards={cards} />
      <hr />
    </ThemeProvider>
  )
}
