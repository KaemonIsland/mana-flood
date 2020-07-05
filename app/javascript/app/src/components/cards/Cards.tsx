import React, { ReactElement } from 'react'
import styled from 'styled-components'
import { Filter } from '../filter'
import { Minimal } from './card'
import { Pagination } from '../Pagination'
import { useMediaQuery } from 'react-responsive'
import { useFilter, useCardsStats, useSort, usePagination } from '../../utils'
import { Card } from '../../interface'

const CardsContainer = styled.section(({ theme, isMobile }) => ({
  display: 'grid',
  gridTemplateColumns: isMobile ? `1fr` : `${theme.spaceScale(12)} 1fr`,
  margin: isMobile && theme.spaceScale(4),
  gridTemplateRows: isMobile ? `${theme.spaceScale(6)} 1fr` : 'auto',
  gridGap: '1rem',
}))

const StyledGrid = styled.div`
  display: grid;
  grid-gap: ${({ theme }) => theme.spaceScale(3)};
  margin: ${({ theme }) => theme.spaceScale(2)};
  grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
  grid-auto-rows: 7rem;
  justify-items: center;
  align-items: center;
`

interface AddCard {
  (id: number): Promise<Card>
}
interface UpdateCard {
  (id: number, quantity: number): Promise<Card>
}
interface RemoveCard {
  (id: number): Promise<Card>
}

interface CardActions {
  addCard: AddCard
  updateCard: UpdateCard
  removeCard: RemoveCard
}

interface Props {
  actions: CardActions
  cards: Array<Card>
  scope: string
}
export const Cards = ({ actions, cards, scope }: Props): ReactElement => {
  const isLoading = cards.length === 0
  const isMobile = useMediaQuery({ maxWidth: 1100 })
  const { filteredCards, clearFilters, ...rest } = useFilter(cards)
  const stats = useCardsStats(cards, scope)
  // const sortedCards = useSort(filteredCards)
  const { paginatedCards, ...pagination } = usePagination(cards)

  return (
    <>
      <CardsContainer isMobile={isMobile}>
        <div />
        <Pagination {...pagination} />
        <Filter stats={stats} clearFilters={clearFilters} {...rest} />
        <StyledGrid>
          {!isLoading &&
            paginatedCards.map(card => (
              <Minimal actions={actions} key={card.id} card={card} />
            ))}
          {isLoading && <h1>...Loading!</h1>}
        </StyledGrid>
        <div />
        <Pagination {...pagination} />
      </CardsContainer>
    </>
  )
}
