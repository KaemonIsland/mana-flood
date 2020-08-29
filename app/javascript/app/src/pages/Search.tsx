import React, { ReactElement, useState } from 'react'
import { Text } from 'warlock-ui'
import { Page, Cards, Search as SearchComponent } from '../components'

export const Search = (): ReactElement => {
  const [query, setQuery] = useState(new URLSearchParams())

  const submitQuery = (query: string): void => {
    setQuery(new URLSearchParams(query))
  }

  return (
    <Page>
      <Text size={10}>Search</Text>
      <SearchComponent callback={submitQuery} />
      <hr />
      <Cards type="search" showFilter={false} options={{ query }} />
    </Page>
  )
}
