import React, { ReactElement } from 'react'
import { Text } from 'warlock-ui'
import { Page, Cards } from '../components'

export const CollectionCards = (): ReactElement => {
  return (
    <Page>
      <Text size={10}>Full Collection</Text>
      <hr />
      <Cards showFilter />
    </Page>
  )
}
