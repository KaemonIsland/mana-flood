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
  height: '100%',
  overflowY: 'scroll',
  padding: theme.spaceScale(4),
}))

const FilterBox = styled.div(({ theme }) => ({
  backgroundColor: theme.color.warmGrey[2],
  borderRadius: theme.spaceScale(2),
  border: '1px solid black',
  padding: theme.spaceScale(1),
  marginBottom: '1rem',
}))

export const Cards = ({ actions, cards }) => {
  const { filteredCards, filters, updateFilters } = useFilter(cards)

  console.log(filteredCards)

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
                name="color"
                id="all"
                value="all"
                onChange={updateFilters}
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
                checked={color.includes('W')}
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
                checked={color.includes('U')}
              />
              <label htmlFor="blue">Blue</label>
            </div>
            <div>
              <input
                type="checkbox"
                name="color"
                id="black"
                onChange={updateFilters}
                checked={color.includes('B')}
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
                checked={color.includes('R')}
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
                checked={color.includes('G')}
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
                checked={color.includes('C')}
              />
              <label htmlFor="colorless">Colorless</label>
            </div>
          </Flex>
        </FilterBox>
        <FilterBox>
          <Flex alignItems="center" justifyContent="space-between">
            <div>Type</div>
            <div>-</div>
          </Flex>
          <hr />
          <Flex direction="column" alignItems="start" justifyContent="start">
            <div>
              <input
                type="radio"
                name="type"
                id="all"
                value="all"
                onChange={updateFilters}
                defaultChecked
              />
              <label htmlFor="all">All</label>
            </div>
            <div>
              <input
                type="radio"
                name="type"
                id="creature"
                value="creature"
                onChange={updateFilters}
              />
              <label htmlFor="creature">Creature</label>
            </div>
            <div>
              <input
                type="radio"
                name="type"
                id="sorcery"
                onChange={updateFilters}
                value="sorcery"
              />
              <label htmlFor="sorcery">Sorcery</label>
            </div>
            <div>
              <input
                type="radio"
                name="type"
                id="instant"
                onChange={updateFilters}
                value="instant"
              />
              <label htmlFor="instant">Instant</label>
            </div>
            <div>
              <input
                type="radio"
                name="type"
                id="enchantment"
                onChange={updateFilters}
                value="enchantment"
              />
              <label htmlFor="enchantment">Enchantment</label>
            </div>
            <div>
              <input
                type="radio"
                name="type"
                id="artifact"
                onChange={updateFilters}
                value="artifact"
              />
              <label htmlFor="artifact">Artifact</label>
            </div>
            <div>
              <input
                type="radio"
                name="type"
                id="planeswalker"
                onChange={updateFilters}
                value="planeswalker"
              />
              <label htmlFor="planeswalker">Planeswalker</label>
            </div>
          </Flex>
        </FilterBox>
        <FilterBox>
          <Flex alignItems="center" justifyContent="space-between">
            <div>Rarity</div>
            <div>-</div>
          </Flex>
          <hr />
          <Flex direction="column" alignItems="start" justifyContent="start">
            <div>
              <input
                type="checkbox"
                name="rarity"
                id="all"
                value="all"
                onChange={updateFilters}
                checked={rarity.length === 0}
              />
              <label htmlFor="all">All</label>
            </div>
            <div>
              <input
                type="checkbox"
                name="rarity"
                id="common"
                value="common"
                onChange={updateFilters}
                checked={rarity.includes('common')}
              />
              <label htmlFor="common">Common</label>
            </div>
            <div>
              <input
                type="checkbox"
                name="rarity"
                id="uncommon"
                onChange={updateFilters}
                value="uncommon"
                checked={rarity.includes('uncommon')}
              />
              <label htmlFor="uncommon">Uncommon</label>
            </div>
            <div>
              <input
                type="checkbox"
                name="rarity"
                id="Rare"
                onChange={updateFilters}
                checked={rarity.includes('rare')}
                value="rare"
              />
              <label htmlFor="Rare">Rare</label>
            </div>
            <div>
              <input
                type="checkbox"
                name="rarity"
                id="mythic"
                onChange={updateFilters}
                checked={rarity.includes('mythic')}
                value="mythic"
              />
              <label htmlFor="mythic">Mythic</label>
            </div>
          </Flex>
        </FilterBox>
        <FilterBox>
          <Flex alignItems="center" justifyContent="space-between">
            <div>CMC</div>
            <div>-</div>
          </Flex>
          <hr />
          <Flex direction="column" alignItems="start" justifyContent="start">
            <div>
              <label htmlFor="min">Min</label>
              <input
                type="number"
                name="min"
                min={0}
                max={20}
                id="min"
                value={cmc.min}
                onChange={updateFilters}
              />
            </div>
            <div>
              <label htmlFor="max">Max</label>
              <input
                type="number"
                name="max"
                min={0}
                max={20}
                value={cmc.max}
                id="max"
                onChange={updateFilters}
              />
            </div>
          </Flex>
        </FilterBox>
      </FilterContent>
      <StyledGrid>
        {filteredCards.map(card => (
          <Card actions={actions} key={card.id} {...card} />
        ))}
      </StyledGrid>
    </CardsContainer>
  )
}
