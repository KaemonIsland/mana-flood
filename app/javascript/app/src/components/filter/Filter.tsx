import React, { useState, useEffect } from 'react'
import { Flex, Button } from 'warlock-ui'
import { useMediaQuery } from 'react-responsive'
import styled, { keyframes } from 'styled-components'
import FocusLock from 'react-focus-lock'
import { disablePageScroll, enablePageScroll } from 'scroll-lock'

const Count = styled.span(({ theme }) => ({
  color: theme.color.grey[6],
}))

const FilterContainer = styled.div(({ theme, isMobile, isOpen }) => ({
  backgroundColor: theme.color.grey[3],
  borderRight: '1px solid black',
  height: '100%',
  overflowY: 'scroll',
  padding: theme.spaceScale(4),
  ...(isMobile
    ? {
        position: 'fixed',
        top: theme.spaceScale(8),
        left: isOpen ? '0' : '-' + theme.spaceScale(13),
        zIndex: 5000,
        transition: 'all 300ms ease-in',
      }
    : {}),
}))

const FilterBox = styled.div(({ theme }) => ({
  backgroundColor: theme.color.warmGrey[2],
  borderRadius: theme.spaceScale(2),
  border: '1px solid black',
  padding: theme.spaceScale(1),
  marginBottom: '1rem',
}))

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }

  100% {
    opacity: 0.6;
  }
`

const Background = styled.div`
  background-color: black;
  background-position: cover;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 950;
  width: 100vw;
  height: 100vh;
  opacity: 0.6;
  animation-name: ${fadeIn};
  animation-duration: 300ms;
`

const FilterContent = ({
  color,
  rarity,
  cmc,
  stats,
  updateFilters,
  isMobile,
  isOpen,
  filters,
}) => (
  <FilterContainer isOpen={isOpen} isMobile={isMobile}>
    <FilterBox>
      <Flex alignItems="center" justifyContent="space-between">
        <div>Color</div>
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
        {[
          { label: 'white', value: 'W' },
          { label: 'blue', value: 'U' },
          { label: 'black', value: 'B' },
          { label: 'red', value: 'R' },
          { label: 'green', value: 'G' },
          { label: 'colorless', value: 'C' },
        ].map(({ label, value }) => (
          <div>
            <input
              type="checkbox"
              name="color"
              id={label}
              value={value}
              onChange={updateFilters}
              checked={color.includes(value)}
            />
            <label htmlFor={label}>
              {label} <Count>({stats.colors[value]})</Count>
            </label>
          </div>
        ))}
      </Flex>
    </FilterBox>
    <FilterBox>
      <Flex alignItems="center" justifyContent="space-between">
        <div>Type</div>
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
        {[
          'creature',
          'sorcery',
          'instant',
          'enchantment',
          'artifact',
          'planeswalker',
        ].map(type => (
          <div>
            <input
              type="radio"
              name="type"
              id={type}
              value={type}
              onChange={updateFilters}
            />
            <label htmlFor={type}>
              {type} <Count>({stats.types[type].count})</Count>
            </label>
          </div>
        ))}
      </Flex>
    </FilterBox>
    <FilterBox>
      <Flex alignItems="center" justifyContent="space-between">
        <div>Rarity</div>
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
        {['common', 'uncommon', 'rare', 'mythic'].map(rarity => (
          <div>
            <input
              type="checkbox"
              name="rarity"
              id={rarity}
              value={rarity}
              onChange={updateFilters}
              checked={filters.rarity.includes(rarity)}
            />
            <label htmlFor={rarity}>
              {rarity} <Count>({stats.rarity[rarity]})</Count>
            </label>
          </div>
        ))}
      </Flex>
    </FilterBox>
    <FilterBox>
      <Flex alignItems="center" justifyContent="space-between">
        <div>CMC</div>
      </Flex>
      <hr />
      <Flex direction="column" alignItems="start" justifyContent="start">
        <div>
          <label htmlFor="min">Min: {cmc.min}</label>
          <input
            type="range"
            name="min"
            min={0}
            max={cmc.max}
            id="min"
            value={cmc.min}
            onChange={updateFilters}
          />
        </div>
        <div>
          <label htmlFor="max">Max: {cmc.max}</label>
          <input
            type="range"
            name="max"
            min={cmc.min}
            max={20}
            value={cmc.max}
            id="max"
            onChange={updateFilters}
          />
        </div>
      </Flex>
    </FilterBox>
  </FilterContainer>
)

export const Filter = ({ stats, updateFilters, filters }) => {
  const isMobile = useMediaQuery({ maxWidth: 650 })
  const [isOpen, setIsOpen] = useState(false)

  const openFilter = () => {
    setIsOpen(true)
    disablePageScroll()
  }

  const closeFilter = () => {
    setIsOpen(false)
    enablePageScroll()
  }

  // Closes the mobile navbar when escape key is pressed
  const closeOnEscape = e => {
    if (e.key === 'Escape') {
      closeFilter()
    }
  }

  useEffect(() => {
    isOpen
      ? addEventListener('keydown', closeOnEscape)
      : removeEventListener('keydown', closeOnEscape)
  }, [isOpen])

  const filterParams = {
    ...filters,
    stats,
    updateFilters,
    filters,
    isMobile,
    isOpen,
  }

  return (
    <div style={{ position: 'relative' }}>
      {isMobile ? (
        <>
          <Button
            onClick={openFilter}
            color="purple"
            bubble={false}
            variant="outline"
            shade={7}
          >
            Filter
          </Button>
          <FocusLock disabled={!isOpen}>
            <FilterContent {...filterParams} disabled={!isOpen} />
          </FocusLock>
        </>
      ) : (
        <FilterContent {...filterParams} />
      )}
      {isMobile && isOpen && <Background onClick={closeFilter} />}
    </div>
  )
}
