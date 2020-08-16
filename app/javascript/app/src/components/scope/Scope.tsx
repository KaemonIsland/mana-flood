import React from 'react'
import styled from 'styled-components'
import { Text, Flex } from 'warlock-ui'
import { Deck } from '../../interface'
import { Dropdown } from '../Dropdown'
import { ManaSymbol } from '../icon'
import { useDropdown } from '../../utils'

const OuterContainer = styled.div(({ theme }) => ({
  margin: `${theme.spaceScale(2)} 0`,
}))

const ScopeContainer = styled.div(({ theme }) => ({
  borderRadius: theme.spaceScale(2),
  backgroundColor: theme.color.purple[2],
  border: '1px solid black',
  width: '16rem',
  padding: theme.spaceScale(1),
  cursor: 'pointer',
}))

const DropdownContainer = styled.div(({ theme }) => ({
  backgroundColor: 'white',
  padding: theme.spaceScale(2),
  borderRadius: theme.spaceScale(2),
  boxShadow: theme.boxShadow.single[2],
  '& > :not(:last-child)': {
    borderBottom: '1px solid black',
  },
}))

const Option = styled.div(({ theme }) => ({
  borderRadius: theme.spaceScale(2),
  margin: `${theme.spaceScale(2)} 0`,
  width: '16rem',
  cursor: 'pointer',
  '&:hover, &:focus, &:active': {
    backgroundColor: 'lightgrey',
  },
}))

interface UpdateScope {
  (id: string | number, options?: any): void
}

interface ScopeProps {
  currentScope: Deck | string
  scopes: Array<Deck>
  updateScope: UpdateScope
}

export const Scope = ({ currentScope, scopes, updateScope }: ScopeProps) => {
  // Info used for displaying the card image
  const { dropdownProps, triggerProps, open, close, isOpen } = useDropdown()

  return (
    <>
      <Dropdown {...dropdownProps} isPaddingless isOpen={isOpen}>
        <DropdownContainer>
          {typeof currentScope !== 'string' && (
            <Option
              onClick={() => {
                updateScope('collection')
                close()
              }}
            >
              <Text size={6} family="roboto">
                Collection
              </Text>
            </Option>
          )}
          {scopes.length &&
            scopes.map(scope => (
              <Option
                key={scope.id}
                onClick={() => {
                  updateScope(scope.id)
                  close()
                }}
              >
                <Flex alignItems="center" justifyContent="start">
                  {scope.colors.length &&
                    scope.colors.map((mana, i) => (
                      <ManaSymbol size="tiny" key={i} mana={mana} />
                    ))}
                </Flex>
                <Text size={3} family="roboto">
                  {scope.name}
                </Text>
              </Option>
            ))}
        </DropdownContainer>
      </Dropdown>

      <OuterContainer>
        <Text size={2} display="block">
          Add cards to:
        </Text>
        <ScopeContainer
          {...triggerProps}
          onClick={() => (isOpen ? close() : open())}
        >
          <Text size={5} family="roboto">
            {typeof currentScope === 'string'
              ? 'Collection'
              : currentScope.name}
          </Text>
        </ScopeContainer>
      </OuterContainer>
    </>
  )
}
