import React from 'react'
import { Navigate, useLoaderData } from 'react-router'
import { Navbar } from './Navbar'
import { Collection } from './src/pages/Collection'
import { Decks } from './src/pages/Decks'
import { Search } from './src/pages/Search'

export const Main = () => {
  const { user } = useLoaderData()

  return user && user.id ? (
    <>
      <Navbar />
      <Search />
      <Collection />
      <hr />
      <Decks />
    </>
  ) : (
    <Navigate to="login" />
  )
}
