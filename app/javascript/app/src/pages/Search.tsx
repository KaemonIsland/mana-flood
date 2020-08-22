import React, { ReactElement, useState } from 'react'
import { Text } from 'warlock-ui'
import { Page, Cards } from '../components'

export const Search = (): ReactElement => {
  const [query, setQuery] = useState(new URLSearchParams('q[name_cont]=jace'))

  return (
    <Page>
      <Text size={10}>Search</Text>
      <Cards type="search" options={{ query }} />
    </Page>
  )
}

// TODO Fix card Stats for searches, and add card view for json builder
