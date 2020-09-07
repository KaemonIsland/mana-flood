import React, { ReactElement, useState, useEffect } from 'react'
import styled from 'styled-components'
import Turbolinks from 'turbolinks'
import { Text, Flex, Container, Button } from 'warlock-ui'
import { useMediaQuery } from 'react-responsive'
import { ManaSymbol, Cards, Page, Collapse, DeckForm } from '../'
import { deckActions, usePopup } from '../../utils'
import { Stats } from './Stats'
import { Deck as DeckType } from '../../interface'

const ButtonOptions = styled.div(({ theme }) => ({
  width: theme.spaceScale(11),
  display: 'grid',
  gridTemplateColumns: '1fr',
  gridTemplateRows: 'repeat(2, 1fr)',
  gridGap: theme.spaceScale(2),
}))

export const Deck = ({ id }: DeckType): ReactElement => {
  const defaultDeck: DeckType = {
    id,
  }

  const isMobile = useMediaQuery({ maxWidth: 650 })
  const isTablet = useMediaQuery({ maxWidth: 950, minWidth: 651 })
  const { triggerProps, popupProps, isOpen, close } = usePopup()
  const [deck, setDeck] = useState(defaultDeck)
  const [isLoading, setIsLoading] = useState(true)

  const getDeck = async (): Promise<void> => {
    const deck = await deckActions.get(id)

    setDeck(deck)

    setIsLoading(false)
  }

  /**
   * Destroys an existing deck
   *
   * @param {number} id - The deck id
   */
  const destroy = async (id: number): Promise<void> => {
    await deckActions.delete(id)

    Turbolinks.visit('/decks')
  }

  /**
   * Updates a existing deck
   *
   * @param {object} deckParams - New deck params include name, description, format, and ID
   */
  const update = async (deckParams): Promise<void> => {
    const updatedDeck = await deckActions.update(id, deckParams)

    close()

    setDeck(updatedDeck)
  }

  useEffect(() => {
    if (isLoading) {
      getDeck()
    }
  }, [isLoading])

  return (
    <Page defaultScope={deck}>
      {isLoading ? (
        <p>...Loading</p>
      ) : (
        <>
          <Flex alignItems="center" justifyContent="start">
            {((deck.colors || []).length &&
              deck.colors.map((mana, i) => (
                <ManaSymbol size="xLarge" key={i} mana={mana} />
              ))) ||
              ''}
          </Flex>
          <Flex alignItems="center" justifyContent="space-between">
            <Flex.Item>
              <Text
                as="h1"
                size={isMobile || isTablet ? 7 : 10}
                family="source sans"
              >
                {deck?.name}
              </Text>
            </Flex.Item>
            <Flex.Item>
              <ButtonOptions>
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
          <Container marginVertical={3}>
            <Text>{deck?.description}</Text>
          </Container>
          <Collapse {...popupProps}>
            <Collapse.Content>
              <DeckForm deck={deck} submitCallback={update} />
            </Collapse.Content>
          </Collapse>
          <hr />
          <Stats stats={deck.stats} />
          <Cards type="deck" showScope={false} />
        </>
      )}
    </Page>
  )
}
