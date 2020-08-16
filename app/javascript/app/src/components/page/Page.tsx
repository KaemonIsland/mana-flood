import React, { ReactElement } from 'react'
import { ThemeProvider } from 'warlock-ui'
import styled from 'styled-components'
import { useMediaQuery } from 'react-responsive'
import { ToastProvider, ScopeProvider } from '../../providers'
import { Deck } from '../../interface'

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
interface PageProps {
  defaultScope?: Deck | string
  children: Array<ReactElement> | ReactElement
}

export const Page = ({ defaultScope, children }: PageProps): ReactElement => {
  const isMobile = useMediaQuery({ maxWidth: 650 })
  return (
    <ThemeProvider>
      <ToastProvider>
        <ScopeProvider defaultScope={defaultScope}>
          <PageContainer>
            <StyledPage isMobile={isMobile}>{children}</StyledPage>
          </PageContainer>
        </ScopeProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}
