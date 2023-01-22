import React, { ReactElement, useState } from 'react'
import { Cards, Search as SearchComponent } from '..'

/**
 * A sidebar search that can be added to any page!
 *
 * Use this when you want to be able to view a deck and still be able to search/add new cards.
 */
export const SearchCollapse = ({ cardOptions }): ReactElement => {
  const [query, setQuery] = useState(new URLSearchParams())
  const [showCards, setShowCards] = useState(false)

  const submitQuery = (query: URLSearchParams): void => {
    setQuery(new URLSearchParams(query))
    setShowCards(true)
  }

  return (
    <div>
      <SearchComponent callback={submitQuery} />
      <hr />
      {showCards && (
        <Cards
          imageOnly
          showFilter={false}
          options={{ query, ...cardOptions }}
        />
      )}
    </div>
  )
}
