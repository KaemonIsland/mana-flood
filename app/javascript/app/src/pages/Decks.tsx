import React, { ReactElement, useState, useEffect } from 'react'
import { Flex, Text } from 'warlock-ui'
import { Page, Decks as DeckList } from '../components'
import { deckActions } from '../utils'

export const Decks = (): ReactElement => {
  const [decks, setDecks] = useState([])
  const [isLoading, setIsLoading] = useState(true)

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
      <hr />
      <Flex direction="column" alignItems="center">
        {isLoading ? '...Loading' : <DeckList decks={decks} />}
      </Flex>
    </Page>
  )
}
