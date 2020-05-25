import React, { ReactElement, useState } from 'react'
import styled from 'styled-components'
import Turbolinks from 'turbolinks'
import { Button, Flex, Text } from 'warlock-ui'
import axios from 'axios'
import { useMediaQuery } from 'react-responsive'
import { Deck } from './types'
import { Form } from './Form'
import { Page } from '../page'

const StyledDecks = styled.div(({ theme }) => ({
  border: '1px solid black',
  backgroundColor: 'white',
  margin: theme.spaceScale(4),
  boxShadow: theme.boxShadow.single[2],
  borderRadius: theme.spaceScale(2),
  width: '100%',
  maxWidth: theme.spaceScale(16),
  padding: theme.spaceScale(2),
}))

const ButtonOptions = styled.div(({ theme, isMobile }) => ({
  width: isMobile ? '100%' : theme.spaceScale(11),
  marginTop: isMobile && theme.spaceScale(4),
  display: 'grid',
  gridTemplateColumns: isMobile ? '1fr 1fr 1fr' : '1fr',
  gridTemplateRows: isMobile ? '1fr' : 'repeat(3, 1fr)',
  gridGap: theme.spaceScale(2),
}))

interface Props {
  decks: Array<Deck>
}

export const Decks = ({ decks }: Props): ReactElement => {
  const [deckList, setDeckList] = useState(decks.reverse())
  const [isUpdating, setIsUpdating] = useState({})
  const [showForm, setShowForm] = useState(false)
  const isMobile = useMediaQuery({ maxWidth: 650 })

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
      await axios.delete(`api/v1/decks/${id}`)

      const filteredDeckList = deckList.filter(deck => deck.id !== id)
      setDeckList(filteredDeckList)
    } catch (error) {
      console.log('Unable to destroy deck: ', error)
    }
  }
  return (
    <Page>
      <Text family="roboto" size={10}>
        My Decks
      </Text>
      <Button onClick={() => setShowForm(true)}>New Deck +</Button>
      <hr />
      {showForm && (
        <Form updateInfo={isUpdating} submitCallback={updateDeckList} />
      )}
      <Flex direction="column" alignItems="center">
        {deckList.map(deck => (
          <StyledDecks key={deck.id}>
            <Flex
              direction={isMobile ? 'column' : 'row'}
              alignItems={isMobile ? 'space-between' : 'flex-start'}
              justifyContent="space-between"
            >
              <div style={{ width: '100%' }}>
                <Text family="roboto" weight="300" size={6}>
                  {deck.name}
                </Text>
                <Text display="inline-block" isItalics>
                  {deck.format}
                </Text>
                <br />
                <Text size={3} family="Open Source Sans">
                  {deck.description}
                </Text>
              </div>
              <ButtonOptions isMobile={isMobile}>
                <Button
                  color="green"
                  shade={7}
                  variant="outline"
                  onClick={() => {
                    Turbolinks.visit(`/deck/${deck.id}`)
                  }}
                >
                  Cards
                </Button>
                <Button
                  color="blue"
                  shade={7}
                  variant="outline"
                  onClick={() => {
                    setIsUpdating(deck)
                    setShowForm(true)
                  }}
                >
                  Edit
                </Button>
                <Button
                  onClick={() => {
                    if (confirm('Are you sure?')) {
                      destroyDeck(deck.id)
                    }
                  }}
                  color="grey"
                  shade={10}
                  variant="text"
                >
                  Remove
                </Button>
              </ButtonOptions>
            </Flex>
          </StyledDecks>
        ))}
      </Flex>
    </Page>
  )
}
