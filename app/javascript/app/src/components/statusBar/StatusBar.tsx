import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import { Button } from 'warlock-ui'

const StyledStatusBar = styled.div(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  width: '100%',
  backgroundColor: theme.color.purple[6],
  color: 'white',
  borderTop: `1px solid ${theme.color.purple[9]}`,
  padding: `${theme.spaceScale(1)} 0`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-around',
}))

StyledStatusBar.Item = styled.div(({ active }) => ({
  borderBottom: `2px solid ${active ? 'white' : 'transparent'}`,
}))

export const StatusBar = ({ scope }) => {
  const { currentScope, updateScope } = scope
  const [decks, setDecks] = useState([])
  const getUserDecks = async () => {
    try {
      const response = await axios('/api/v1/decks')

      if (response.data) {
        setDecks(response.data)
      }
    } catch (error) {
      console.log('Error: ', error)
    }
  }

  useEffect(() => {
    if (decks.length === 0) {
      getUserDecks()
    }
  }, [])

  return (
    <StyledStatusBar>
      <StyledStatusBar.Item active={currentScope === 'collection'}>
        <Button
          onClick={() => updateScope('collection')}
          color="purple"
          shade={7}
        >
          Collection
        </Button>
      </StyledStatusBar.Item>
      {decks.map(deck => (
        <StyledStatusBar.Item active={currentScope === deck.name}>
          <Button
            onClick={() => updateScope(deck.name, deck)}
            color="purple"
            shade={7}
          >
            {deck.name}
          </Button>
        </StyledStatusBar.Item>
      ))}
    </StyledStatusBar>
  )
}
