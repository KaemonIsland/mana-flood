import React from 'react'
import { ThemeProvider } from 'warlock-ui'
import styled from 'styled-components'
import { useMediaQuery } from 'react-responsive'

const PageContainer = styled.div(() => ({
  width: '100%',
  position: 'relative',
}))

const StyledPage = styled.div(({ theme, isMobile }) => ({
  width: '100%',
  margin: ' auto',
  maxWidth: '1400px',
  padding: isMobile ? `0 ${theme.spaceScale(2)}` : `0 ${theme.spaceScale(4)}`,
}))

export const Page = ({ children }) => {
  const isMobile = useMediaQuery({ maxWidth: 650 })
  return (
    <ThemeProvider>
      <PageContainer>
        <StyledPage isMobile={isMobile}>{children}</StyledPage>
      </PageContainer>
    </ThemeProvider>
  )
}
