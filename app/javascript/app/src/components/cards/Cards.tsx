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
interface Scope {
  currentScope: string
  updateScope
}

interface Get {
  (id: number, deckId?: number): Promise<Array<Card>>
}

interface Add {
  (id: number, deckId?: number): Promise<Card>
}

interface Update {
  (id: number, quantity: number, deckId?: number): Promise<Card>
}

interface Remove {
  (id: number, deckId?: number): Promise<Card>
}

interface CollectionFunc {
  (id: number): Promise<Array<Card> | Card>
}

interface DeckFunc {
  (id: number, deckId: number): Promise<Array<Card> | Card>
}

interface Set {
  collection: CollectionFunc
  deck: DeckFunc
}

interface CardActionFunc {
  set: Set
  get: Get
  add: Add
  update: Update
  remove: Remove
}

interface Props {
  actions: CardActionFunc
  cards: Array<Card>
  scope: Scope
}
export const Cards = ({ actions, cards, scope }: Props): ReactElement => {
  const isLoading = cards.length === 0
  const isMobile = useMediaQuery({ maxWidth: 1100 })
  const { filteredCards, ...rest } = useFilter(cards)
  const stats = useCardsStats(cards, scope)
  const sortedCards = useSort(filteredCards)
  const { paginatedCards, ...pagination } = usePagination(sortedCards)

  return (
    <>
      <CardsContainer isMobile={isMobile}>
        <div />
        <Pagination {...pagination} />
        <Filter stats={stats} {...rest} />
        <StyledGrid>
          {!isLoading &&
            paginatedCards.map(card => (
              <Minimal actions={actions} key={card.id} {...card} />
            ))}
          {isLoading && <h1>...Loading!</h1>}
        </StyledGrid>
        <div />
        <Pagination {...pagination} />
      </CardsContainer>
    </>
  )
}
