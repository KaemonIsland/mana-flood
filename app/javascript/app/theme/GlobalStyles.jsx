import React from 'react'
import { GlobalStyles, ThemeProvider } from 'warlock-ui'
import { createGlobalStyle } from 'styled-components'

// font family allows us to use the keyrune icons!
const ManaFloodGlobal = createGlobalStyle`
  body {
    background-color: ${({ theme }) => theme.color.coolGrey[2]};
    font-family: Roboto, sans-serif;
  }
  *,
  *::before,
  *::after {
    font-family: unset;
  }
`

const ManaFloodTheme = () => (
  <ThemeProvider>
    <GlobalStyles />
    <ManaFloodGlobal />
  </ThemeProvider>
)

export default ManaFloodTheme
