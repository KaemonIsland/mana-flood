import React, { ReactElement, useState, useEffect } from 'react'
import styled from 'styled-components'
import { Text, Flex, Container, Button } from 'warlock-ui'
import { useMediaQuery } from 'react-responsive'
import {
  ManaSymbol,
  DeckCards,
  Collapse,
  DeckForm,
  SearchCollapse,
  Drawer,
} from '../'
import { deckActions, usePopup } from '../../utils'
import { Stats } from './Stats'
import { useNavigate } from 'react-router'

const ButtonOptions = styled.div(({ theme, isMobile }) => ({
  width: isMobile ? '100%' : theme.spaceScale(11),
  display: 'grid',
  gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr',
  gridTemplateRows: isMobile ? '1fr' : 'repeat(2, 1fr)',
  gridGap: theme.spaceScale(2),
}))

const getCardCount = (cards = []) => {
  let count = 0
  cards.forEach(({ deck }) => {
    if (deck && deck.quantity) {
      count += deck.quantity
    }
  })
  return count
}

export const Deck = ({ deckId }): ReactElement => {
  const navigate = useNavigate()
  const isMobile = useMediaQuery({ maxWidth: 650 })
  // const isTablet = useMediaQuery({ maxWidth: 950, minWidth: 651 })
  const { triggerProps, popupProps, isOpen, close } = usePopup()
  const [deck, setDeck] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const getDeck = async (): Promise<void> => {
    try {
      const deck = await deckActions.get(deckId)
      setDeck(deck)
    } catch (error) {
      console.log('Unable to get deck', error)
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Destroys an existing deck
   *
   * @param {number} id - The deck id
   */
  const destroy = async (id: number): Promise<void> => {
    await deckActions.delete(id)

    navigate('/')
  }

  /**
   * Updates a existing deck
   *
   * @param {object} deckParams - New deck params include name, description, format, and ID
   */
  const update = async (deckParams): Promise<void> => {
    const updatedDeck = await deckActions.update(deckId, deckParams)

    close()

    setDeck(updatedDeck)
  }

  useEffect(() => {
    if (isLoading) {
      getDeck()
    }
  }, [isLoading])

  return (
    <>
      {isLoading ? (
        <p>...Loading</p>
      ) : (
        <>
          <Flex alignItems="center" justifyContent="space-between">
            <Flex.Item>
              <Flex alignItems="center" justifyContent="start">
                {(deck.colors || []).length ? (
                  deck.colors.map((mana, i) => (
                    <ManaSymbol size="medium" key={i} mana={mana} />
                  ))
                ) : (
                  <ManaSymbol size={isMobile ? 'medium' : 'xLarge'} mana="C" />
                )}
              </Flex>
              <Text as="h1" size={8} family="source sans">
                {deck?.name}
              </Text>
              <Text as="p" size={3} family="roboto">
                Deck Size: {getCardCount(deck?.cards)}
              </Text>
            </Flex.Item>
            <Flex.Item>
              <ButtonOptions isMobile={isMobile}>
                <Button
                  onClick={(): void => {
                    if (confirm('Are you sure?')) {
                      destroy(deckId)
                    }
                  }}
                  color="grey"
                  shade={10}
                  variant="text"
                >
                  Delete
                </Button>
                <Button
                  color="blue"
                  shade={7}
                  variant="outline"
                  {...triggerProps}
                >
                  {isOpen ? 'Cancel' : 'Edit'}
                </Button>
              </ButtonOptions>
            </Flex.Item>
          </Flex>
          {deck?.descriptions && (
            <Container marginVertical={3}>
              <Text>{deck?.description}</Text>
            </Container>
          )}
          <Collapse {...popupProps}>
            <Collapse.Content>
              <DeckForm deck={deck} submitCallback={update} />
            </Collapse.Content>
          </Collapse>
          <hr />
          <Button onClick={() => setIsDrawerOpen(!isDrawerOpen)}>
            Search Cards
          </Button>
          <hr />
          <Stats stats={deck.stats} />
          <br />
          <DeckCards deck={deck} updateDeck={getDeck} />

          <Drawer
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            style={{ width: '100%', boxShadow: 'none' }}
          >
            <Container padding={4}>
              <Button onClick={() => setIsDrawerOpen(false)}>
                Close Drawer
              </Button>
              <SearchCollapse
                cardOptions={{
                  deckId: deck.id,
                  name: deck.name,
                  updateDeck: getDeck,
                }}
              />
            </Container>
          </Drawer>
        </>
      )}
    </>
  )
}
