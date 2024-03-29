import React, { useState, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import fetch from 'cross-fetch'
import Turbolinks from 'turbolinks'
import { ThemeProvider, Text } from 'warlock-ui'
import FocusLock from 'react-focus-lock'
import { disablePageScroll, enablePageScroll } from 'scroll-lock'

const MobileNavContainer = styled.nav(({ theme, isOpen }) => ({
  width: theme.spaceScale(12),
  height: '100vh',
  color: 'white',
  borderRight: '1px solid black',
  backgroundColor: theme.color.purple[2],
  position: 'fixed',
  top: 0,
  left: isOpen ? '0' : '-' + theme.spaceScale(12),
  transition: 'all 300ms ease-in',
  padding: [theme.spaceScale(2), 0].join(' '),
  textAlign: 'left',
  zIndex: 5000,
  overflow: 'hidden',
}))

MobileNavContainer.Link = styled('li')(({ theme, isActive, type }) => ({
  cursor: 'pointer',
  transition: 'all 200ms ease-in',
  padding: [
    theme.spaceScale(2),
    theme.spaceScale(2),
    theme.spaceScale(1),
    theme.spaceScale(2),
  ].join(' '),
  marginBottom: type === 'logo' ? theme.spaceScale(4) : 0,
  borderRadius: `0 ${theme.spaceScale(1)} ${theme.spaceScale(1)} 0`,
  borderBottom: isActive
    ? `${theme.spaceScale(1)} solid ${theme.color.purple[7]}`
    : `${theme.spaceScale(1)} solid transparent`,
  '&:active, &:hover, &:focus': {
    backgroundColor: theme.color.purple[7],
  },
  '& a': {
    display: 'block',
    color: 'black',
    textDecoration: 'none',
  },
  '&:active a, &:hover a, &:focus a': {
    color: 'white',
  },
}))

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }

  100% {
    opacity: 0.6;
  }
`

const Background = styled.div`
  background-color: black;
  background-position: cover;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 950;
  width: 100vw;
  height: 100vh;
  opacity: 0.6;
  animation-name: ${fadeIn};
  animation-duration: 300ms;
`

const OuterNavbarLink = styled(MobileNavContainer.Link)(
  ({ theme, isActive }) => ({
    borderRadius: isActive
      ? `${theme.spaceScale(1)} ${theme.spaceScale(1)} 0 0`
      : theme.spaceScale(1),
    '&:hover, &:focus, &:active': {
      color: 'white',
    },
    '& a': {
      fontWeight: 'bold',
    },
    '&:hover a, &:focus a, &:active a': {
      color: 'white',
    },
  })
)

const AuthContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'start',
  marginTop: theme.spaceScale(6),
  color: 'black',
}))

AuthContainer.Link = styled('li')(({ theme }) => ({
  cursor: 'pointer',
  transition: 'all 200ms ease-in',
  margin: [0, theme.spaceScale(2)].join(' '),
  borderBottom: `${theme.spaceScale(1)} solid transparent`,
  '&:active, &:hover, &:focus': {
    borderBottom: `${theme.spaceScale(1)} solid ${theme.color.purple[7]}`,
  },
  '& a': {
    color: 'black',
    textDecoration: 'none',
  },
}))

/**
 * Navigation bar that should always be present on webpage.
 * It shows the current action link.
 */
export const MobileNavbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const openNav = () => {
    setIsOpen(true)
    disablePageScroll()
  }

  const closeNav = () => {
    setIsOpen(false)
    enablePageScroll()
  }

  const handleLogout = async () => {
    const csrfToken = document
      .querySelector('meta[name=csrf-token]')
      .getAttribute('content')

    try {
      await fetch('/logout', {
        method: 'DELETE',
        headers: {
          'X-CSRF-Token': csrfToken,
        },
      })

      Turbolinks.visit('/')
    } catch (error) {
      console.log("Couldn't logout", error)
    }
  }

  // Decides which link is the active link
  const isActiveLink = (path: string, isExact: boolean): boolean => {
    const pathname: string = window.location.pathname
    return isExact ? pathname === path : pathname.includes(path)
  }

  // Closes the mobile navbar when escape key is pressed
  const closeOnEscape = e => {
    if (e.key === 'Escape') {
      closeNav()
    }
  }

  useEffect(() => {
    isOpen
      ? addEventListener('keydown', closeOnEscape)
      : removeEventListener('keydown', closeOnEscape)
  }, [isOpen])

  return (
    <ThemeProvider>
      <ul>
        <OuterNavbarLink tabIndex={1} isActive={isActiveLink('/', true)}>
          <a href="/">Mana Flood</a>
        </OuterNavbarLink>
        <FocusLock disabled={!isOpen}>
          <MobileNavContainer isOpen={isOpen} role="menu" id="navbar-menu">
            <AuthContainer>
              <AuthContainer.Link tabIndex={4} onClick={() => handleLogout()}>
                <Text size={2}>
                  <a>Logout</a>
                </Text>
              </AuthContainer.Link>
              //{' '}
              <>
                //{' '}
                <AuthContainer.Link tabIndex={5}>
                  //{' '}
                  <Text size={2}>
                    // <a href="/login">Login</a>
                    //{' '}
                  </Text>
                  //{' '}
                </AuthContainer.Link>
                // {' - '}
                //{' '}
                <AuthContainer.Link tabIndex={6}>
                  //{' '}
                  <Text size={2}>
                    // <a href="/register">Sign Up</a>
                    //{' '}
                  </Text>
                  //{' '}
                </AuthContainer.Link>
                //{' '}
              </>
            </AuthContainer>
          </MobileNavContainer>
        </FocusLock>
        {isOpen && <Background onClick={closeNav} />}
        <OuterNavbarLink
          tabIndex={2}
          onClick={openNav}
          role="button"
          aria-controls="navbar-menu"
        >
          Menu
        </OuterNavbarLink>
      </ul>
    </ThemeProvider>
  )
}
