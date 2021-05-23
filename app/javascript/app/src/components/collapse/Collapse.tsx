/* eslint-disable react/display-name */
import React, { ReactElement } from 'react'
import styled from 'styled-components'

const StyledCollapse = styled.div(({ theme, color, shade }) => ({
  padding: theme.spaceScale(2),
  borderRadius: theme.spaceScale(2),
  backgroundColor: color && shade ? theme.color[color][shade] : 'transparent',
}))

interface CollapseProps {
  children: Array<ReactElement> | ReactElement
  isOpen: boolean
  color?: string
  shade?: number
}

export const Collapse = ({
  children,
  isOpen,
  color,
  shade = 3,
  ...props
}: CollapseProps): ReactElement => {
  const childrenWithExtraProp = React.Children.map(children, child =>
    React.cloneElement(child, { isOpen })
  )
  return (
    <StyledCollapse color={color} shade={shade} {...props}>
      {childrenWithExtraProp}
    </StyledCollapse>
  )
}

interface HeaderProps {
  children: ReactElement
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
  maxHeight: isOpen ? '300rem' : '0rem',
  visibility: !isOpen && 'hidden',
  overflow: 'hidden',
  transition: 'all 300ms ease-in-out',
}))

interface ContentProps {
  children: ReactElement
  isOpen?: boolean
}

Collapse.Content = ({ children, isOpen }: ContentProps): ReactElement => (
  <CollapseContent isOpen={isOpen}>{children}</CollapseContent>
)
