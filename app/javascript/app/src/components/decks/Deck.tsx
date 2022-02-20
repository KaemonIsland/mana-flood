import React, { ReactElement, useState, useEffect } from 'react'
import styled from 'styled-components'
import Turbolinks from 'turbolinks'
import { Text, Flex, Container, Button } from 'warlock-ui'
import { useMediaQuery } from 'react-responsive'
import {
  ManaSymbol,
  Cards,
  Page,
  Collapse,
  DeckForm,
  SearchCollapse,
} from '../'
import { deckActions, usePopup } from '../../utils'
import { Stats } from './Stats'
import { Deck as DeckType } from '../../interface'
import { Drawer } from '..'

const ButtonOptions = styled.div(({ theme, isMobile }) => ({
  width: isMobile ? '100%' : theme.spaceScale(11),
  display: 'grid',
  gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr',
  gridTemplateRows: isMobile ? '1fr' : 'repeat(2, 1fr)',
  gridGap: theme.spaceScale(2),
}))

export const Deck = ({ id }: DeckType): ReactElement => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
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
            {(deck.colors || []).length ? (
              deck.colors.map((mana, i) => (
                <ManaSymbol
                  size={isMobile ? 'medium' : 'xLarge'}
                  key={i}
                  mana={mana}
                />
              ))
            ) : (
              <ManaSymbol size={isMobile ? 'medium' : 'xLarge'} mana="C" />
            )}
          </Flex>
          <Flex
            direction={isMobile ? 'column' : 'row'}
            alignItems={isMobile ? 'stretch' : 'center'}
            justifyContent="space-between"
          >
            <Flex.Item>
              <Text
                as="h1"
                size={isMobile || isTablet ? 8 : 10}
                family="source sans"
              >
                {deck?.name}
              </Text>
            </Flex.Item>
            <Flex.Item>
              <ButtonOptions isMobile={isMobile}>
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
          <br />
          <Button onClick={() => setIsDrawerOpen(!isDrawerOpen)}>
            Add Cards
          </Button>
          <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
            <Container padding={4}>
              <Button onClick={() => setIsDrawerOpen(false)}>
                Close Drawer
              </Button>

              <SearchCollapse />
            </Container>
          </Drawer>
          <br />
          <Cards type="deck" showScope={false} imageOnly showFilter={false} />
        </>
      )}
    </Page>
  )
}
