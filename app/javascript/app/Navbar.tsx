import React from 'react'
import styled from 'styled-components'
import fetch from 'cross-fetch'
import Turbolinks from 'turbolinks'
import { ThemeProvider, Text } from 'warlock-ui'
import { useMediaQuery } from 'react-responsive'
import { MobileNavbar } from './MobileNavbar'

const NavContainer = styled.div(({ theme }) => ({
  position: 'fixed',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  top: 0,
  width: '100%',
  height: '54px',
  backgroundColor: theme.color.purple[2],
  boxShadow: theme.boxShadow.single[2],
  borderBottom: '1px solid black',
  zIndex: 1000,
}))

const NavBar = styled.nav(({ theme, isMobile }) => ({
  position: 'fixed',
  top: 0,
  width: '100%',
  maxWidth: '1400px',
  backgroundColor: theme.color.purple[2],
  padding: isMobile
    ? theme.spaceScale(2)
    : `${theme.spaceScale(2)} ${theme.spaceScale(4)}`,
  borderBottom: '1px solid black',
  zIndex: 100000000,
  '& ul': {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}))

const NavPadding = styled.div`
  margin-bottom: ${({ theme }) => theme.spaceScale(8)};
`

NavContainer.Link = styled('a')(({ theme, isActive }) => ({
  cursor: 'pointer',
  transition: 'all 200ms ease-in',
  padding: [
    theme.spaceScale(2),
    theme.spaceScale(2),
    theme.spaceScale(1),
    theme.spaceScale(2),
  ].join(' '),
  borderRadius: isActive
    ? `${theme.spaceScale(1)} ${theme.spaceScale(1)} 0 0`
    : theme.spaceScale(1),
  borderBottom: isActive
    ? `${theme.spaceScale(1)} solid ${theme.color.purple[7]}`
    : `${theme.spaceScale(1)} solid transparent`,
  color: 'black',
  textDecoration: 'none',
  '&:active, &:hover, &:focus': {
    backgroundColor: theme.color.purple[7],
    color: 'white',
  },
}))

NavContainer.Logo = styled(NavContainer.Link)(({ theme }) => ({
  fontSize: theme.fontScale(5),
  fontWeight: 'bold',
}))

const AuthContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'center',
  boxShadow: theme.boxShadow.outset(theme.color.purple[2]),
  padding: [
    theme.spaceScale(2),
    theme.spaceScale(2),
    theme.spaceScale(1),
    theme.spaceScale(2),
  ].join(' '),
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

const links = [
  {
    path: '/collection',
    isExact: false,
    title: 'Collection',
  },
  {
    path: '/decks',
    isExact: true,
    title: 'Decks',
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
      <NavPadding />
      <NavContainer>
        <NavBar isMobile={isMobile}>
          {isMobile ? (
            <MobileNavbar links={links} signedIn={signedIn} />
          ) : (
            <ul>
              <li tabIndex={1}>
                <NavContainer.Logo isActive={isActiveLink('/', true)} href="/">
                  Mana Flood
                </NavContainer.Logo>
              </li>
              {links.map(({ path, title, isExact }, i) => (
                <li tabIndex={i + 1} key={path}>
                  <NavContainer.Link
                    isActive={isActiveLink(path, isExact)}
                    href={path}
                  >
                    {title}
                  </NavContainer.Link>
                </li>
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
        </NavBar>
      </NavContainer>
    </ThemeProvider>
  )
}
