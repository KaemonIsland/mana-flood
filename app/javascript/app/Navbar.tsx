import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import fetch from 'cross-fetch'
import Turbolinks from 'turbolinks'
import { ThemeProvider, Text } from 'warlock-ui'
import { useMediaQuery } from 'react-responsive'
import { MobileNavbar } from './MobileNavbar'

const NavContainer = styled('nav')(({ theme }) => ({
  position: 'sticky',
  backgroundColor: theme.color.purple[2],
  top: 0,
  boxShadow: theme.boxShadow.single[2],
  padding: theme.formatSpace(3),
  borderBottom: '1px solid black',
  '& ul': {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}))

NavContainer.Link = styled('li')(({ theme, isActive }) => ({
  cursor: 'pointer',
  transition: 'all 200ms ease-in',
  padding: [
    theme.formatSpace(2),
    theme.formatSpace(2),
    theme.formatSpace(1),
    theme.formatSpace(2),
  ].join(' '),
  borderRadius: isActive
    ? `${theme.formatSpace(1)} ${theme.formatSpace(1)} 0 0`
    : theme.formatSpace(1),
  borderBottom: isActive
    ? `${theme.formatSpace(1)} solid ${theme.color.purple[7]}`
    : `${theme.formatSpace(1)} solid transparent`,
  '&:active, &:hover, &:focus': {
    backgroundColor: theme.color.purple[7],
  },
  '& a': {
    color: 'black',
    textDecoration: 'none',
  },
  '&:active a, &:hover a, &:focus a': {
    color: 'white',
  },
}))

const AuthContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'center',
  boxShadow: theme.boxShadow.outset(theme.color.purple[2]),
  padding: [
    theme.formatSpace(2),
    theme.formatSpace(2),
    theme.formatSpace(1),
    theme.formatSpace(2),
  ].join(' '),
}))

AuthContainer.Link = styled('li')(({ theme }) => ({
  cursor: 'pointer',
  transition: 'all 200ms ease-in',
  margin: [0, theme.formatSpace(2)].join(' '),
  borderBottom: `${theme.formatSpace(1)} solid transparent`,
  '&:active, &:hover, &:focus': {
    borderBottom: `${theme.formatSpace(1)} solid ${theme.color.purple[7]}`,
  },
  '& a': {
    color: 'black',
    textDecoration: 'none',
  },
}))

const links = [
  {
    path: '/',
    isExact: true,
    type: 'logo',
    title: (
      <Text size={5} isBold>
        Mana Flood
      </Text>
    ),
  },
  {
    path: '/collection',
    isExact: false,
    title: 'Collection',
  },
  {
    path: '/sets',
    isExact: false,
    title: 'Sets',
  },
  {
    path: '/search',
    isExact: false,
    title: 'Search',
  },
]

/**
 * Navigation bar that should always be present on webpage.
 * It shows the current action link.
 */
export const Navbar = ({ signedIn }) => {
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

  const isMobile = useMediaQuery({ maxWidth: 650 })

  return (
    <ThemeProvider>
      <NavContainer>
        {isMobile ? (
          <MobileNavbar links={links} signedIn={signedIn} />
        ) : (
          <ul>
            {links.map(({ path, title, isExact }, i) => (
              <NavContainer.Link
                tabIndex={i + 1}
                key={path}
                isActive={isActiveLink(path, isExact)}
              >
                <a href={path}>{title}</a>
              </NavContainer.Link>
            ))}
            <AuthContainer>
              {signedIn ? (
                <AuthContainer.Link
                  tabIndex={10}
                  onClick={() => handleLogout()}
                >
                  <Text size={2}>
                    <a>Logout</a>
                  </Text>
                </AuthContainer.Link>
              ) : (
                <>
                  <AuthContainer.Link tabIndex={11}>
                    <Text size={2}>
                      <a href="/login">Login</a>
                    </Text>
                  </AuthContainer.Link>
                  {' / '}
                  <AuthContainer.Link tabIndex={12}>
                    <Text size={2}>
                      <a href="/register">Sign Up</a>
                    </Text>
                  </AuthContainer.Link>
                </>
              )}
            </AuthContainer>
          </ul>
        )}
      </NavContainer>
    </ThemeProvider>
  )
}
