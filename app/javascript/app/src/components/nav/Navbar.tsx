import React, { useState } from 'react'
import styled from 'styled-components'
import fetch from 'cross-fetch'
import { Link, useNavigate } from 'react-router-dom'
import { ThemeProvider, Text, Container, Button, Flex } from 'warlock-ui'
import { SearchCollapse, Drawer } from '../'

const NavContainer = styled.div(({ theme }) => ({
  position: 'fixed',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  top: 0,
  left: 0,
  width: '100%',
  height: '54px',
  backgroundColor: theme.color.purple[2],
  boxShadow: theme.boxShadow.single[2],
  borderBottom: '1px solid black',
  zIndex: 1000,
}))

const NavBar = styled.nav(({ theme }) => ({
  position: 'fixed',
  top: 0,
  width: '100%',
  maxWidth: '1400px',
  backgroundColor: theme.color.purple[2],
  padding: `${theme.spaceScale(2)} ${theme.spaceScale(4)}`,
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

NavContainer.Link = styled(Link)(({ theme, isActive }) => ({
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

/**
 * Navigation bar that should always be present on webpage.
 * It shows the current action link.
 */
export const Navbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const navigate = useNavigate()

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

      navigate('/login')
    } catch (error) {
      console.log("Couldn't logout", error)
    }
  }

  // Decides which link is the active link
  const isActiveLink = (path: string, isExact: boolean): boolean => {
    const pathname: string = window.location.pathname
    return isExact ? pathname === path : pathname.includes(path)
  }

  return (
    <ThemeProvider>
      <NavPadding />
      <NavContainer>
        <NavBar>
          <ul>
            <li tabIndex={1}>
              <NavContainer.Logo isActive={isActiveLink('/', true)} to="/">
                Mana Flood
              </NavContainer.Logo>
            </li>
            <li>
              <Button onClick={() => setIsDrawerOpen(!isDrawerOpen)}>
                Add Cards to Collection
              </Button>
            </li>
            <AuthContainer>
              <AuthContainer.Link tabIndex={10} onClick={() => handleLogout()}>
                <Text size={2}>
                  <a>Logout</a>
                </Text>
              </AuthContainer.Link>
              {/* <>
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
                  </> */}
            </AuthContainer>
          </ul>
        </NavBar>
      </NavContainer>

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        style={{ width: '100%', boxShadow: 'none' }}
      >
        <Container padding={4}>
          <Flex alignItems="center" justifyContent="space-between">
            <Button onClick={() => setIsDrawerOpen(false)}>Close Drawer</Button>
            <Flex.Item>
              <Text>Add Cards to Collection</Text>
            </Flex.Item>
          </Flex>
          <SearchCollapse />
        </Container>
      </Drawer>
    </ThemeProvider>
  )
}
