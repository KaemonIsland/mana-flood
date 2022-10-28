import React, { ReactElement, useEffect, useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Turbolinks from 'turbolinks'
import { getUser } from './src/utils'
import { Main } from './Main'
import { Navbar } from './Navbar'
import { Deck } from './src/pages/Deck'
import { deckLoader } from './loaders'

const router = createBrowserRouter([
  { path: '/', element: <Main /> },
  { path: '/deck/:deckId', element: <Deck />, loader: deckLoader },
])

export const App = (): ReactElement => {
  const [isInitialized, setIsInitialized] = useState(false)
  const [user, setUser] = useState(null)

  // Get the current user to determine if they are logged in
  const initialize = async () => {
    const { user } = await getUser()

    setUser(user)
  }

  // Initialize the application on the first render
  useEffect(() => {
    if (!isInitialized) {
      initialize()
      setIsInitialized(true)
    }
  }, [isInitialized])

  // Redirect to the login page if the user is not logged in and the app is initialized
  if (isInitialized && user === false) {
    Turbolinks.visit('/login')
  }

  return (
    <>
      <Navbar />
      <RouterProvider router={router} />
    </>
  )
}
