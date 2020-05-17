import React, { useContext } from 'react'
import { Flex, Text } from 'warlock-ui'
import { Card } from './Card'
import { useFilter } from '../../utils'
import styled from 'styled-components'

const CardsContainer = styled.section(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: `${theme.spaceScale(12)} 1fr`,
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

const FilterContent = styled.div(({ theme }) => ({
  backgroundColor: theme.color.grey[3],
  borderRight: '1px solid black',
  height: '100vh',
  overflowY: 'hidden',
  padding: theme.spaceScale(4),
}))

const FilterBox = styled.div(({ theme }) => ({
  backgroundColor: theme.color.warmGrey[2],
  borderRadius: theme.spaceScale(2),
  border: '1px solid black',
  padding: theme.spaceScale(1),
}))

export const Cards = ({ actions, cards }) => {
  const { filteredCards, filters, updateFilters } = useFilter(cards)

  const { color, type, rarity, cmc } = filters

  return (
    <CardsContainer>
      <FilterContent>
        <FilterBox>
          <Flex alignItems="center" justifyContent="space-between">
            <div>Color</div>
            <div>-</div>
          </Flex>
          <hr />
          <Flex direction="column" alignItems="start" justifyContent="start">
            <div>
              <input
                type="checkbox"
                id="all"
                value="all"
                checked={color.length === 0}
              />
              <label htmlFor="all">All</label>
            </div>
            <div>
              <input
                type="checkbox"
                name="color"
                id="white"
                value="W"
                onChange={updateFilters}
              />
              <label htmlFor="white">White</label>
            </div>
            <div>
              <input
                type="checkbox"
                name="color"
                id="blue"
                onChange={updateFilters}
                value="U"
              />
              <label htmlFor="blue">Blue</label>
            </div>
            <div>
              <input
                type="checkbox"
                name="color"
                id="black"
                onChange={updateFilters}
                value="B"
              />
              <label htmlFor="black">Black</label>
            </div>
            <div>
              <input
                type="checkbox"
                name="color"
                id="red"
                onChange={updateFilters}
                value="R"
              />
              <label htmlFor="red">Red</label>
            </div>
            <div>
              <input
                type="checkbox"
                name="color"
                id="green"
                onChange={updateFilters}
                value="G"
              />
              <label htmlFor="green">Green</label>
            </div>
            <div>
              <input
                type="checkbox"
                name="color"
                id="colorless"
                onChange={updateFilters}
                value="C"
              />
              <label htmlFor="colorless">Colorless</label>
            </div>
          </Flex>
        </FilterBox>
        <FilterBox>CMC</FilterBox>
        <FilterBox>Type</FilterBox>
        <FilterBox>Rarity</FilterBox>
      </FilterContent>
      <StyledGrid>
        {filteredCards.map(card => (
          <Card actions={actions} key={card.id} {...card} />
        ))}
      </StyledGrid>
    </CardsContainer>
  )
}
