import React, { ReactElement, useState } from 'react'
import styled from 'styled-components'
import { ThemeProvider, Button, Container } from 'warlock-ui'
import axios from 'axios'
import { Deck } from './types'
import { Form } from './Form'

const StyledDecks = styled.div(({ theme }) => ({
  border: '1px solid black',
  width: theme.spaceScale(16),
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
      <div>
        {deckList.map(deck => (
          <StyledDecks key={deck.id}>
            <h2>{deck.name}</h2>
            <h3>{deck.format}</h3>
            <h4>{deck.description}</h4>
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
          </StyledDecks>
        ))}
      </div>
    </ThemeProvider>
  )
}
