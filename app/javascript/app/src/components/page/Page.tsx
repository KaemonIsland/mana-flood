import React, { ReactElement } from 'react'
import { ThemeProvider } from 'warlock-ui'
import styled from 'styled-components'
import { useMediaQuery } from 'react-responsive'
import { Toast } from '../toast'

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
  children: Array<ReactElement> | ReactElement
}

export const Page = ({ children }: PageProps): ReactElement => {
  const isMobile = useMediaQuery({ maxWidth: 650 })
  return (
    <ThemeProvider>
      <PageContainer>
        <Toast
          toastList={[
            { id: 1, title: 'Test', message: 'This is a test!' },
            { id: 2, title: 'Test', message: 'This is a test!' },
            { id: 3, title: 'Test', message: 'This is a test!' },
            { id: 4, title: 'Test', message: 'This is a test!' },
          ]}
        />
        <StyledPage isMobile={isMobile}>{children}</StyledPage>
      </PageContainer>
    </ThemeProvider>
  )
}
