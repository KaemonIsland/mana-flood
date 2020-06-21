import React, { ReactElement } from 'react'
import styled from 'styled-components'

const StyledLink = styled.a(({ theme }) => ({
  color: 'black',
  cursor: 'pointer',
  textDecoration: 'none',
}))

interface LinkProps {
  href: string
  isDisabled?: boolean
  target?: string
  children: any
}

/**
 * Returns a link. Has some styling preferences
 */
export const Link = ({
  href,
  isDisabled = false,
  target = '_self',
  children,
}: LinkProps): ReactElement => (
  <StyledLink target={target} href={href} isDisabled={isDisabled}>
    {children}
  </StyledLink>
)
