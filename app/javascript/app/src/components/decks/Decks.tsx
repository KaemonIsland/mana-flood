import React, { ReactElement, useState } from 'react'
import styled from 'styled-components'
import { ThemeProvider, Button, Flex, Text } from 'warlock-ui'
import axios from 'axios'
import { Deck } from './types'
import { Form } from './Form'

const StyledDecks = styled.div(({ theme }) => ({
  border: '1px solid black',
  backgroundColor: 'white',
  margin: theme.spaceScale(4),
  boxShadow: theme.boxShadow.single[2],
  borderRadius: theme.spaceScale(1),
  width: theme.spaceScale(16),
  padding: theme.spaceScale(2),
}))

interface Props {
  decks: Array<Deck>
}

export const Decks = ({ decks }: Props): ReactElement => {
  const [deckList, setDeckList] = useState(decks.reverse())
  const [isUpdating, setIsUpdating] = useState({})
  const [showForm, setShowForm] = useState(false)

  const updateDeckList = newDeck => {
    if (newDeck?.id) {
      const filteredDeckList = deckList.filter(deck => deck.id !== newDeck.id)
      setDeckList([newDeck, ...filteredDeckList])
    } else {
      setDeckList([newDeck, ...deckList])
    }
    setShowForm(false)
  }

  const destroyDeck = async id => {
    try {
      const response = await axios.delete(`api/v1/decks/${id}`)

      const filteredDeckList = deckList.filter(deck => deck.id !== id)
      setDeckList(filteredDeckList)
      console.log('Response: ', response)
    } catch (error) {
      console.log('Unable to destroy deck: ', error)
    }
  }
  return (
    <ThemeProvider>
      <h1>My Decks</h1>
      <Button onClick={() => setShowForm(true)}>New Deck +</Button>
      <hr />
      {showForm && (
        <Form updateInfo={isUpdating} submitCallback={updateDeckList} />
      )}
      <Flex direction="column" alignItems="center">
        {deckList.map(deck => (
          <StyledDecks key={deck.id}>
            <Flex alignItems="flex-start" justifyContent="space-between">
              <div style={{ width: '80%' }}>
                <Text family="roboto" weight={300} size={6}>
                  {deck.name}
                </Text>
                <Text display="inline-block" isItalics>
                  {deck.format}
                </Text>

                <hr />

                <Text size={3} family="Open Source Sans">
                  {deck.description}
                </Text>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Button
                  color="blue"
                  shade={3}
                  variant="filled"
                  onClick={() => {
                    setIsUpdating(deck)
                    setShowForm(true)
                  }}
                >
                  Update
                </Button>
                <Button
                  onClick={() => destroyDeck(deck.id)}
                  color="red"
                  shade={7}
                  variant="text"
                >
                  Destroy
                </Button>
              </div>
            </Flex>
          </StyledDecks>
        ))}
      </Flex>
    </ThemeProvider>
  )
}
