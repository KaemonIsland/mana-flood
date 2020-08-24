/* eslint-disable react/display-name */
import React, { ReactElement, ReactChild } from 'react'
import styled from 'styled-components'

const StyledCollapse = styled.div(({ theme, color, shade }) => ({
  padding: theme.spaceScale(2),
  borderRadius: theme.spaceScale(2),
  backgroundColor: color && shade ? theme.color[color][shade] : 'transparent',
}))

interface CollapseProps {
  children: Array<ReactChild> | ReactChild
  isOpen: boolean
  color?: string
  shade?: number
}

export const Collapse = ({
  children,
  isOpen,
  color,
  shade = 3,
}: CollapseProps): ReactElement => {
  const childrenWithExtraProp = React.Children.map(children, child =>
    React.cloneElement(child, { isOpen })
  )
  return (
    <StyledCollapse color={color} shade={shade}>
      {childrenWithExtraProp}
    </StyledCollapse>
  )
}

interface HeaderProps {
  children: Array<ReactChild> | ReactChild
  isOpen?: boolean
}

const CollapseHeader = styled.section(({ theme, isOpen }) => ({
  padding: `${theme.spaceScale(2)} 0`,
  marginBottom: isOpen ? theme.spaceScale(2) : '0',
  transition: 'all 300ms ease-in-out',
}))

Collapse.Header = ({ children, isOpen }: HeaderProps): ReactElement => (
  <CollapseHeader isOpen={isOpen}>{children}</CollapseHeader>
)

const CollapseContent = styled.section(({ isOpen }) => ({
  height: '100%',
  maxHeight: isOpen ? '100rem' : '0rem',
  overflow: 'hidden',
  transition: 'all 300ms ease-in-out',
}))

interface ContentProps {
  children: Array<ReactChild> | ReactChild
  isOpen?: boolean
}

Collapse.Content = ({ children, isOpen }: ContentProps): ReactElement => (
  <CollapseContent isOpen={isOpen}>{children}</CollapseContent>
)
