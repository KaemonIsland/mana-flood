import React, { ReactElement } from 'react'
import styled from 'styled-components'
import { useMediaQuery } from 'react-responsive'
import { Filter } from '../filter'
import { Minimal } from './card'
import { Pagination } from '../Pagination'
import { Scope } from '../scope'
import { useFilter, useCards } from '../../utils'
import { useScope } from '../../providers'

const CardsContainer = styled.section(({ theme, isMobile, showFilter }) => ({
  display: 'grid',
  gridTemplateColumns:
    isMobile || !showFilter ? `1fr` : `${theme.spaceScale(12)} 1fr`,
  margin: isMobile && theme.spaceScale(4),
  gridTemplateRows: isMobile ? `${theme.spaceScale(6)} 1fr` : 'auto',
  gridGap: '1rem',
}))

const StyledGrid = styled.div`
  display: grid;
  grid-gap: ${({ theme }) => theme.spaceScale(3)};
  grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
  grid-auto-rows: 7rem;
  justify-items: center;
  align-items: start;
`

interface Options {
  setId?: number
  setType?: string
  deckId?: number
  query?: URLSearchParams
}

interface Props {
  options?: Options
  type: string
  showScope?: boolean
  showFilter?: boolean
}
export const Cards = ({
  type,
  options,
  showScope = true,
  showFilter = true,
}: Props): ReactElement => {
  const { currentScope, scopes, updateScope } = useScope()
  const { actions, cards, pagination, stats } = useCards(
    type,
    currentScope,
    options
  )
  const isLoading = !cards.length
  const isMobile = useMediaQuery({ maxWidth: 1100 })
  const filter = useFilter(actions.get)

  const results = `Showing ${30 * (pagination.page - 1) + 1} - 
  ${
    30 * pagination.page > pagination.total
      ? pagination.total
      : 30 * pagination.page
  } 
  of ${pagination.total} unique cards`

  return (
    <>
      <div>{results}</div>
      <CardsContainer showFilter={showFilter} isMobile={isMobile}>
        <div>
          {showScope && (
            <Scope
              currentScope={currentScope}
              scopes={scopes}
              updateScope={updateScope}
            />
          )}
        </div>
        <Pagination {...pagination} />
        {showFilter && <Filter stats={stats} {...filter} />}
        <StyledGrid>
          {isLoading ? (
            <h1>...Loading!</h1>
          ) : (
            cards.map(card => (
              <Minimal actions={actions} key={card.id} card={card} />
            ))
          )}
        </StyledGrid>
        <div />
        <Pagination {...pagination} />
      </CardsContainer>
    </>
  )
}
