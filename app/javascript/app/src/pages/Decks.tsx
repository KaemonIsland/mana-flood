import React, { ReactElement, useState, useEffect } from 'react'
import { Text, Button } from 'warlock-ui'
import { Page, Decks as DeckList, Collapse, DeckForm } from '../components'
import { deckActions, usePopup } from '../utils'

export const Decks = (): ReactElement => {
  const [decks, setDecks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { triggerProps, popupProps, isOpen, close } = usePopup()

  /**
   * Creates a new deck
   *
   * @param {object} deckParams - New deck params include name, description and format
   */
  const create = async (deckParams): Promise<void> => {
    const deck = await deckActions.create(deckParams)

    setDecks([deck, ...decks])
    close()
  }

  const getUserDecks = async (): Promise<void> => {
    const decks = await deckActions.all()
    setDecks(decks)
    setIsLoading(false)
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
          <DeckForm submitCallback={create} />
        </Collapse.Content>
      </Collapse>
      <hr />
      <>{isLoading ? '...Loading' : <DeckList decks={decks} />}</>
    </Page>
  )
}
