import React, { ReactElement } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { getUser } from './src/utils'
import { Main } from './Main'

const router = createBrowserRouter([
  { path: '/', element: <Main />, loader: getUser },
])

export const App = (): ReactElement => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}
