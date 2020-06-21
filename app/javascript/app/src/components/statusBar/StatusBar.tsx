import React, { useEffect, useState, ReactElement } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import { Button } from 'warlock-ui'
import { toCamelcase } from '../../utils'

const StyledStatusBar = styled.div(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  backgroundColor: theme.color.purple[6],
  color: 'white',
  borderTop: `1px solid ${theme.color.purple[9]}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  maxWidth: '1370px',
}))

StyledStatusBar.Item = styled.div(({ theme, active }) => ({
  padding: `${theme.spaceScale(1)}`,
  borderBottom: `2px solid ${active ? 'white' : 'transparent'}`,
}))

interface UpdateScope {
  (newScope: string, deckInfo?: {}): void
}

interface Scope {
  currentScope: string
  updateScope: UpdateScope
}

interface StatusBarProps {
  scope: Scope
}

export const StatusBar = ({ scope }: StatusBarProps): ReactElement => {
  const { currentScope, updateScope } = scope
  const [decks, setDecks] = useState([])
  const getUserDecks = async (): Promise<void> => {
    try {
      const response = await axios('/api/v1/decks')

      if (response.data) {
        setDecks(toCamelcase(response.data))
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
          onClick={(): void => updateScope('collection')}
          color="purple"
          shade={7}
        >
          Collection
        </Button>
      </StyledStatusBar.Item>
      {decks.map(deck => (
        <StyledStatusBar.Item
          key={deck.name}
          active={currentScope === deck.name}
        >
          <Button
            onClick={(): void => updateScope(deck.name, deck)}
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
