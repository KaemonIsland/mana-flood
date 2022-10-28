import React from 'react'
import { Collection } from './src/pages/Collection'
import { Decks } from './src/pages/Decks'
import { Search } from './src/pages/Search'

export const Main = () => {
  return (
    <>
      <Search />
      <Collection />
      <hr />
      <Decks />
    </>
  )
}
