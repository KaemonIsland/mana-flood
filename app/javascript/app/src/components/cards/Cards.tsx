import React, { ReactElement } from 'react'
import styled from 'styled-components'
import { useMediaQuery } from 'react-responsive'
import { Filter } from '../filter'
import { Minimal, ImageOnly } from './card'
import { Pagination } from '../Pagination'
import { Scope } from '../scope'
import { useFilter, useCards } from '../../utils'
import { useScope } from '../../providers'
import { Legend } from '../legend'

const CardsContainer = styled.section(({ theme, isMobile, showFilter }) => ({
  display: 'grid',
  gridTemplateColumns:
    isMobile || !showFilter ? `1fr` : `${theme.spaceScale(12)} 1fr`,
  margin: isMobile && theme.spaceScale(4),
  gridTemplateRows: isMobile ? `${theme.spaceScale(6)} 1fr` : 'auto',
  gridGap: '1rem',
}))

const StyledGrid = styled.div(({ theme, imageOnly }) => ({
  display: 'grid',
  gridGap: theme.spaceScale(3),
  gridTemplateColumns: `repeat(auto-fill, minmax(${
    imageOnly ? '16rem' : '22rem'
  }, 1fr))`,
  gridAutoRows: imageOnly ? '26rem' : '7rem',
  justifyItems: 'center',
  alignItems: 'start',
}))

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
  imageOnly?: boolean
  showPagination?: boolean
}

export const Cards = ({
  type,
  options,
  showScope = true,
  showFilter = true,
  imageOnly = false,
  showPagination = true,
}: Props): ReactElement => {
  const isMobile = useMediaQuery({ maxWidth: 1100 })
  const { currentScope, scopes, updateScope } = useScope()
  const { actions, cards, pagination, stats, isLoading } = useCards(
    type,
    currentScope,
    options
  )
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
      <Legend />
      <hr />
      {showPagination && <div>{results}</div>}
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
        {showPagination && <Pagination {...pagination} />}
        {showFilter && <Filter stats={stats} {...filter} />}
        <StyledGrid imageOnly={imageOnly}>
          {isLoading ? (
            <h1>...Loading!</h1>
          ) : (
            cards.map(card =>
              imageOnly ? (
                <ImageOnly actions={actions} key={card.id} card={card} />
              ) : (
                <Minimal actions={actions} key={card.id} card={card} />
              )
            )
          )}
        </StyledGrid>
        <div />
        {showPagination && <Pagination {...pagination} />}
      </CardsContainer>
    </>
  )
}
