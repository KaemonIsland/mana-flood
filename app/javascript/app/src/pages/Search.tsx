import React, { ReactElement, useState } from 'react'
import { Text } from 'warlock-ui'
import { Page, Cards } from '../components'

export const Search = (): ReactElement => {
  const [query, setQuery] = useState(new URLSearchParams())

  return (
    <Page>
      <Text size={10}>Search</Text>
      <Cards type="search" options={{ query }} />
    </Page>
  )
}

// TODO move query to first param for card actions
