import React, { ReactElement } from 'react'
import { Flex, Text } from 'warlock-ui'
import { Deck } from '../interface'
import { Page, Decks as DeckList } from '../components'

interface Props {
  decks: Array<Deck>
}

export const Decks = ({ decks }: Props): ReactElement => {
  const deckList = decks.reverse()

  return (
    <Page>
      <Text size={10}>Decks</Text>
      <hr />
      <Flex direction="column" alignItems="center">
        <DeckList decks={deckList} />
      </Flex>
    </Page>
  )
}
