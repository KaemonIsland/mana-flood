import React, { ReactElement } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { Button, Flex, Text, Container } from 'warlock-ui'
import { Deck } from '../../interface'
import { ManaSymbol } from '../icon'

const StyledDecksPreview = styled.div(({ theme }) => ({
  border: '1px solid black',
  backgroundColor: 'white',
  margin: theme.spaceScale(4),
  boxShadow: theme.boxShadow.single[2],
  borderRadius: theme.spaceScale(2),
  width: '100%',
  maxWidth: theme.spaceScale(13),
  padding: theme.spaceScale(2),
}))

interface DecksProps {
  decks: Array<Deck>
}

export const DecksPreview = ({ decks = [] }: DecksProps): ReactElement => {
  const navigate = useNavigate()
  // Converts decks to on object with the key being the format
  const decksByFormat = decks.reduce((deckFormats, deck) => {
    const { format } = deck

    if (deckFormats[format]) {
      deckFormats[format].push(deck)
    } else {
      deckFormats[format] = [deck]
    }

    return deckFormats
  }, {})

  return (
    <>
      {Object.entries(decksByFormat).map(([format, decksInFormat]) => {
        return (
          <>
            <h2>{format.toUpperCase()}</h2>
            <hr />
            <Flex
              flexWrap="wrap"
              justifyContent="space-evenly"
              alignItems="center"
            >
              {(decksInFormat || []).map(deck => (
                <StyledDecksPreview key={deck.id}>
                  <Flex
                    isColumn
                    alignItems="space-between"
                    justifyContent="space-between"
                  >
                    <div style={{ width: '100%' }}>
                      <Flex alignItems="center" justifyContent="start">
                        {(deck.colors || []).length ? (
                          deck.colors.map((mana, i) => (
                            <ManaSymbol size="medium" key={i} mana={mana} />
                          ))
                        ) : (
                          <ManaSymbol size="medium" mana="C" />
                        )}
                      </Flex>
                      <Text family="roboto" weight="300" size={5}>
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
                        style={{ width: '100%' }}
                        onClick={() => {
                          navigate(`/deck/${deck.id}`)
                        }}
                      >
                        View
                      </Button>
                    </Container>
                  </Flex>
                </StyledDecksPreview>
              ))}
            </Flex>
          </>
        )
      })}
    </>
  )
}
