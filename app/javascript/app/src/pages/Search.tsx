import React, { ReactElement, useState } from 'react'
import { Page, Cards, Search as SearchComponent } from '../components'

export const Search = (): ReactElement => {
  const [query, setQuery] = useState(new URLSearchParams())

  const submitQuery = (query: URLSearchParams): void => {
    setQuery(new URLSearchParams(query))
  }

  return (
    <Page>
      <SearchComponent callback={submitQuery} />
      <hr />
      <Cards type="search" imageOnly showFilter={false} options={{ query }} />
    </Page>
  )
}
