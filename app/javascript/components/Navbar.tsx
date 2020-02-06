import React from 'react'
import styled from 'styled-components'
import fetch from 'cross-fetch'
import Turbolinks from 'turbolinks'

const NavContainer = styled('nav')`
  position: sticky;
  top: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  padding: 1rem;
  border-bottom: 2px solid black;
`

const StyledLink = styled('div')`
  cursor: pointer;
  padding: 1rem;
`

const links = {
  login: {
    path: '/login',
    name: 'Log In',
    method: 'GET',
  },
  logout: {
    path: '/logout',
    name: 'Log Out',
    method: 'DELETE',
  },
}

const Login = () => {
  const handleLogin = () => {
    Turbolinks.visit('/login')
  }
  return <StyledLink onClick={handleLogin}>Log In</StyledLink>
}

const Logout = () => {
  const csrfToken = document
    .querySelector('meta[name=csrf-token]')
    .getAttribute('content')

  const handleLogout = async () => {
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
  return <StyledLink onClick={handleLogout}>Logout</StyledLink>
}

export const Navbar = ({ signedIn }) => {
  return (
    <NavContainer>
      <p>Mana Flood!</p>
      {signedIn ? <Logout /> : <Login />}
    </NavContainer>
  )
}
