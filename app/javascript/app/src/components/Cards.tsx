import React from 'react'
import { Card } from './Card'
import styled from 'styled-components'

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
  console.log('Cards: ', cards)
  return (
    <StyledGrid>
      {cards.map((card) => (
        <Card key={card.id} {...card} />
      ))}
    </StyledGrid>
  )
}
