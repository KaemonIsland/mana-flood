import React, { ReactElement, useState, useEffect } from 'react'
import { Flex, Text, Button, Container } from 'warlock-ui'
import { Page, Decks as DeckList, Collapse, DeckForm } from '../components'
import { deckActions, usePopup } from '../utils'

export const Decks = (): ReactElement => {
  const [decks, setDecks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(null)
  const { triggerProps, popupProps, isOpen, close, open } = usePopup()

  /**
   * Creates a new deck
   *
   * @param {object} deckParams - New deck params include name, description and format
   */
  const create = async (deckParams): Promise<void> => {
    const deck = await deckActions.create(deckParams)

    setDecks([deck, ...decks])
  }

  /**
   * Updates a existing deck
   *
   * @param {object} deckParams - New deck params include name, description, format, and ID
   */
  const update = async (deckParams): Promise<void> => {
    const updatedDeck = await deckActions.update(deckParams?.id, deckParams)
    const filteredDecks = decks.filter(deck => deck.id !== deckParams?.id)

    setDecks([updatedDeck, ...filteredDecks])
  }

  const handleSubmit = (deckParams): void => {
    if (deckParams?.id) {
      update(deckParams)
    } else {
      create(deckParams)
    }

    close()
    setIsUpdating(null)
  }

  /**
   * Destroys an existing deck
   *
   * @param {number} id - The deck id
   */
  const destroy = async (id: number): Promise<void> => {
    await deckActions.delete(id)

    setDecks(decks.filter(deck => deck.id !== id))
  }

  const getUserDecks = async (): Promise<void> => {
    const decks = await deckActions.all()
    setDecks(decks)
    setIsLoading(false)
  }

  const cancelUpdate = () => {
    setIsUpdating(null)
    close()
  }

  useEffect(() => {
    if (isLoading) {
      getUserDecks()
    }
  }, [isLoading])

  return (
    <Page>
      <Text size={10}>Decks</Text>
      <Button {...triggerProps} color="purple" shade={7}>
        {isOpen ? 'Hide' : 'Show'} Form
      </Button>
      <Collapse {...popupProps}>
        <Collapse.Content>
          <Container marginBottom={2}>
            {(isUpdating && (
              <>
                <Text size={4} display="inline">{`Updating `}</Text>
                <Text size={4} weight={700} display="inline">
                  {isUpdating?.name}
                </Text>
              </>
            )) || (
              <Text size={4} display="inline">
                Create a new deck
              </Text>
            )}
          </Container>
          <DeckForm
            disabled={!isOpen}
            updateInfo={isUpdating}
            cancelUpdate={() => cancelUpdate()}
            submitCallback={handleSubmit}
          />
        </Collapse.Content>
      </Collapse>
      <hr />
      <Flex direction="column" alignItems="center">
        {isLoading ? (
          '...Loading'
        ) : (
          <DeckList
            decks={decks}
            actions={{
              update: deck => {
                setIsUpdating(deck)
                open(true)
              },
              destroy,
            }}
          />
        )}
      </Flex>
    </Page>
  )
}
