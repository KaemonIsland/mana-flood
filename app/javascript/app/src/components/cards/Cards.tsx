import React, { useContext } from 'react'
import { Card } from './Card'
import styled from 'styled-components'
import { StatusBar } from '../statusBar'
import { useCards } from '../../utils'

const StyledGrid = styled.div`
  display: grid;
  grid-gap: ${({ theme }) => theme.spaceScale(3)};
  margin: ${({ theme }) => theme.spaceScale(2)};
  grid-template-columns: repeat(
    auto-fill,
    minmax(${({ theme }) => theme.spaceScale(13)}, 1fr)
  );
  justify-items: center;
  align-items: center;
`

export const Cards = ({ cards }) => {
  const { actions, deck, container, updateContainer } = useCards('collection')

  return (
    <>
      <StyledGrid>
        {cards.map(card => (
          <Card actions={actions} deck={deck} key={card.id} {...card} />
        ))}
      </StyledGrid>
      <StatusBar container={container} updateContainer={updateContainer} />
    </>
  )
}
