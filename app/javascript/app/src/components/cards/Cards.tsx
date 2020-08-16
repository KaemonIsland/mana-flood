import React, { ReactElement } from 'react'
import styled from 'styled-components'
import { useMediaQuery } from 'react-responsive'
import { Filter } from '../filter'
import { Minimal } from './card'
import { Pagination } from '../Pagination'
import { useFilter, useCards } from '../../utils'
import { useScope } from '../../providers'

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
  grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
  grid-auto-rows: 7rem;
  justify-items: center;
  align-items: start;
`

interface Options {
  setId?: number
  setType?: string
  deckId?: number
}

interface Props {
  options?: Options
  type: string
}
export const Cards = ({ type, options }: Props): ReactElement => {
  const { currentScope, updateScope, scopes } = useScope()
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
      <div>
        <p>
          Adding Cards to{' '}
          {typeof currentScope === 'string' ? 'Collection' : currentScope.name}
        </p>
        <select
          onBlur={e => {
            updateScope(e.target.value)
          }}
          defaultValue={
            typeof currentScope === 'string' ? 'Collection' : currentScope.id
          }
        >
          <option value="collection">Collection</option>
          {scopes.length &&
            scopes.map(scope => (
              <option key={scope.id} value={scope.id}>
                {scope.name}
              </option>
            ))}
        </select>
      </div>
      <CardsContainer isMobile={isMobile}>
        <div />
        <Pagination {...pagination} />
        <Filter stats={stats} {...filter} />
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
