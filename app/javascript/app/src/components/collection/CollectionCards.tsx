import React, { ReactElement } from 'react'
import { Text } from 'warlock-ui'
import { Cards } from '../cards/Cards'
import { Page } from '../page'

interface CollectionCardsProps {
  setId: number
}

export const CollectionCards = ({
  setId,
}: CollectionCardsProps): ReactElement => {
  return (
    <Page>
      <Text size={10}>My Collection</Text>
      <hr />
      <Cards scope="collection" options={{ id: setId }} />
    </Page>
  )
}
