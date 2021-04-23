import React, { ReactElement } from 'react'
import styled from 'styled-components'
import Turbolinks from 'turbolinks'
import { Button, Flex, Text, Container } from 'warlock-ui'
import { Deck } from '../../interface'
import { ManaSymbol } from '../icon'

const StyledDecks = styled.div(({ theme }) => ({
  border: '1px solid black',
  backgroundColor: 'white',
  margin: theme.spaceScale(4),
  boxShadow: theme.boxShadow.single[2],
  borderRadius: theme.spaceScale(2),
  width: '100%',
  maxWidth: theme.spaceScale(12),
  padding: theme.spaceScale(2),
}))

interface DecksProps {
  decks: Array<Deck>
}

export const Decks = ({ decks = [] }: DecksProps): ReactElement => (
  <Flex flexWrap="wrap" justifyContent="center" alignItems="center">
    {decks.map(deck => (
      <StyledDecks key={deck.id}>
        <Flex
          isColumn
          alignItems="space-between"
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
          </div>
          <Container marginTop={3}>
            <Button
              color="green"
              shade={7}
              variant="outline"
              onClick={(): void => {
                Turbolinks.visit(`/deck/${deck.id}`)
              }}
              style={{ width: '100%' }}
            >
              View
            </Button>
          </Container>
        </Flex>
      </StyledDecks>
    ))}
  </Flex>
)
