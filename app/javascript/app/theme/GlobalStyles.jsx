import React from 'react'
import { GlobalStyles, ThemeProvider } from 'warlock-ui'
import { createGlobalStyle } from 'styled-components'

const ManaFloodGlobal = createGlobalStyle`
  body {
    background-color: ${({ theme }) => theme.color.coolGrey[2]};
  }
`

const ManaFloodTheme = () => (
  <ThemeProvider>
    <GlobalStyles />
    <ManaFloodGlobal />
  </ThemeProvider>
)

export default ManaFloodTheme
