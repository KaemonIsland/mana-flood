import React, { ReactElement, useState, useEffect } from 'react'
import axios from 'axios'
import { Flex, Text } from 'warlock-ui'
import { Page, Decks as DeckList } from '../components'
import { toCamelcase } from '../utils'

export const Decks = (): ReactElement => {
  const [decks, setDecks] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const getUserDecks = async (): Promise<void> => {
    try {
      const response = await axios('/api/v1/decks')

      if (response.data) {
        setDecks(toCamelcase(response.data))
      }
    } catch (error) {
      console.log('Unable to get user decks: ', error)
    }
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
