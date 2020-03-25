import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Turbolinks from 'turbolinks'
import { ThemeProvider, Flex, Text, Grid } from 'warlock-ui'
import { formatDate } from '../utils'
import { Cards } from './Cards'

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

  const getSetCards = async () => {
    fetch(`/api/v1/set_cards/${id}`, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(cardsData => setCards(cardsData))
      .catch(error => console.log('Unable to get cards: ', error))
  }

  useEffect(() => {
    if (cards.length === 0) {
      getSetCards()
    }
  }, [])

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
      <Cards cards={cards} />
    </ThemeProvider>
  )
}
