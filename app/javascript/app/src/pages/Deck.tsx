import React, { ReactElement } from 'react'
import { Page, Deck } from '../components'
import { useLoaderData } from 'react-router'

export const DeckPage = (): ReactElement => {
  const { id: deckId } = useLoaderData()

  return (
    <Page>
      <Deck deckId={deckId} />
    </Page>
  )
}
