import React from 'react'
import { Filter } from '../filter'
import { Card } from './Card'
import { useMediaQuery } from 'react-responsive'
import { useFilter, useCardsStats } from '../../utils'
import styled from 'styled-components'

const CardsContainer = styled.section(({ theme, isMobile }) => ({
  display: 'grid',
  gridTemplateColumns: isMobile ? `1fr` : `${theme.spaceScale(12)} 1fr`,
  gridTemplateRows: isMobile ? `${theme.spaceScale(6)} 1fr` : 'auto',
  gridGap: '1rem',
}))

const StyledGrid = styled.div`
  display: grid;
  grid-gap: ${({ theme }) => theme.spaceScale(3)};
  margin: ${({ theme }) => theme.spaceScale(2)};
  grid-template-columns: repeat(
    auto-fill,
    minmax(${({ theme }) => theme.spaceScale(13)}, 1fr)
  );
  grid-auto-rows: 9rem;
  justify-items: center;
  align-items: center;
`

export const Cards = ({ actions, cards, scope }) => {
  const isMobile = useMediaQuery({ maxWidth: 800 })
  const stats = useCardsStats(cards, scope)
  const { filteredCards, ...rest } = useFilter(cards)

  return (
    <CardsContainer isMobile={isMobile}>
      <Filter stats={stats} {...rest} />
      <StyledGrid>
        {filteredCards.map(card => (
          <Card actions={actions} key={card.id} {...card} />
        ))}
      </StyledGrid>
    </CardsContainer>
  )
}
