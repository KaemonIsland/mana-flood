import React, { ReactElement, useState, useEffect } from 'react'
import styled from 'styled-components'
import Turbolinks from 'turbolinks'
import { Button, Flex, Text } from 'warlock-ui'
import { useMediaQuery } from 'react-responsive'
import { Deck } from '../../interface'
import { ManaSymbol } from '../icon'
import { DeckForm } from './DeckForm'
import { deckActions } from '../../utils'

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

interface Actions {
  update: (deck: Deck) => void
  destroy: (id: number) => void
}

interface DecksProps {
  decks: Array<Deck>
  actions: Actions
}

export const Decks = ({ decks = [], actions }: DecksProps): ReactElement => {
  const { update, destroy } = actions
  const isMobile = useMediaQuery({ maxWidth: 650 })

  return (
    <Flex direction="column" alignItems="center">
      {decks.map(deck => (
        <StyledDecks key={deck.id}>
          <Flex
            direction={isMobile ? 'column' : 'row'}
            alignItems={isMobile ? 'space-between' : 'flex-start'}
            justifyContent="space-between"
          >
            <div style={{ width: '100%' }}>
              <Flex alignItems="center" justifyContent="start">
                {((deck.colors || []).length &&
                  deck.colors.map((mana, i) => (
                    <ManaSymbol size="medium" key={i} mana={mana} />
                  ))) ||
                  ''}
              </Flex>
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
                onClick={(): void => {
                  Turbolinks.visit(`/deck/${deck.id}`)
                }}
              >
                Cards
              </Button>
              <Button
                color="blue"
                shade={7}
                variant="outline"
                onClick={(): void => {
                  update(deck)
                }}
              >
                Edit
              </Button>
              <Button
                onClick={(): void => {
                  if (confirm('Are you sure?')) {
                    destroy(deck.id)
                  }
                }}
                color="grey"
                shade={10}
                variant="text"
              >
                Delete
              </Button>
            </ButtonOptions>
          </Flex>
        </StyledDecks>
      ))}
    </Flex>
  )
}
