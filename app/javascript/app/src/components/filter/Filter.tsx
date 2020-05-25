import React, { useState, useEffect } from 'react'
import { Flex, Button, Container, Text } from 'warlock-ui'
import { useMediaQuery } from 'react-responsive'
import styled, { keyframes } from 'styled-components'
import FocusLock from 'react-focus-lock'
import { disablePageScroll, enablePageScroll } from 'scroll-lock'

const StyledLabel = styled.label(({ theme, disabled }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  opacity: disabled && 0.5,
}))

const Count = styled.span(({ theme }) => ({
  color: theme.color.grey[6],
}))

const FilterContainer = styled.div(({ theme, isMobile, isOpen }) => ({
  backgroundColor: 'white',
  border: '1px solid black',
  borderRadius: theme.spaceScale(1),
  boxShadow: theme.boxShadow.single[1],
  height: '100%',
  ...(isMobile
    ? {
        position: 'fixed',
        top: 0,
        left: isOpen ? '0' : '-' + theme.spaceScale(13),
        zIndex: 2000000000,
        transition: 'all 300ms ease-in',
        overflowY: 'scroll',
      }
    : {}),
}))

const FilterBox = styled.div(({ theme }) => ({
  padding: theme.spaceScale(2),
  marginBottom: '1rem',
  lineHeight: 1.5,
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
  z-index: 1500000000;
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
        <Text family="roboto">COLOR</Text>
      </Flex>
      <hr />
      <Flex direction="column" alignItems="start" justifyContent="start">
        <Container width="100%">
          <StyledLabel>
            <span>
              <input
                type="checkbox"
                name="color"
                value="all"
                onChange={updateFilters}
                checked={color.length === 0}
              />
              All
            </span>
          </StyledLabel>
        </Container>
        {[
          { label: 'white', value: 'W' },
          { label: 'blue', value: 'U' },
          { label: 'black', value: 'B' },
          { label: 'red', value: 'R' },
          { label: 'green', value: 'G' },
          { label: 'multi', value: 'M' },
          { label: 'colorless', value: 'C' },
        ].map(({ label, value }) => (
          <Container width="100%">
            <StyledLabel disabled={!stats.colors[value]}>
              <span>
                <input
                  type="checkbox"
                  name="color"
                  value={value}
                  onChange={updateFilters}
                  checked={color.includes(value)}
                  disabled={!stats.colors[value]}
                />
                {label}
              </span>
              <Count>({stats.colors[value]})</Count>
            </StyledLabel>
          </Container>
        ))}
      </Flex>
    </FilterBox>
    <FilterBox>
      <Flex alignItems="center" justifyContent="space-between">
        <Text family="roboto">TYPE</Text>
      </Flex>
      <hr />
      <Flex direction="column" alignItems="start" justifyContent="start">
        <Container width="100%">
          <StyledLabel>
            <span>
              <input
                type="radio"
                name="type"
                value="all"
                onChange={updateFilters}
                defaultChecked
              />
              All
            </span>
          </StyledLabel>
        </Container>
        {[
          'creature',
          'sorcery',
          'instant',
          'enchantment',
          'artifact',
          'planeswalker',
          'land',
        ].map(type => (
          <Container width="100%">
            <StyledLabel disabled={!stats.types[type].count}>
              <span>
                <input
                  type="radio"
                  name="type"
                  value={type}
                  onChange={updateFilters}
                  disabled={!stats.types[type].count}
                />
                {type}
              </span>
              <Count>({stats.types[type].count})</Count>
            </StyledLabel>
          </Container>
        ))}
      </Flex>
    </FilterBox>
    <FilterBox>
      <Flex alignItems="center" justifyContent="space-between">
        <Text family="roboto">RARITY</Text>
      </Flex>
      <hr />
      <Flex direction="column" alignItems="start" justifyContent="start">
        <Container width="100%">
          <StyledLabel>
            <span>
              <input
                type="checkbox"
                name="rarity"
                value="all"
                onChange={updateFilters}
                checked={rarity.length === 0}
              />
              All
            </span>
          </StyledLabel>
        </Container>
        {['common', 'uncommon', 'rare', 'mythic'].map(rarity => (
          <Container width="100%">
            <StyledLabel disabled={!stats.rarity[rarity]}>
              <span>
                <input
                  type="checkbox"
                  name="rarity"
                  value={rarity}
                  onChange={updateFilters}
                  checked={filters.rarity.includes(rarity)}
                  disabled={!stats.rarity[rarity]}
                />

                {rarity}
              </span>
              <Count>({stats.rarity[rarity]})</Count>
            </StyledLabel>
          </Container>
        ))}
      </Flex>
    </FilterBox>
    <FilterBox>
      <Flex alignItems="center" justifyContent="space-between">
        <Text family="roboto">CMC</Text>
      </Flex>
      <hr />
      <Flex direction="column" alignItems="start" justifyContent="start">
        <Container width="100%">
          <StyledLabel htmlFor="min">
            <span>Min: {cmc.min}</span>
          </StyledLabel>
          <input
            type="range"
            name="min"
            min={0}
            max={cmc.max}
            id="min"
            value={cmc.min}
            onChange={updateFilters}
          />
        </Container>
        <Container width="100%">
          <StyledLabel htmlFor="max">
            <span>Max: {cmc.max}</span>
          </StyledLabel>
          <input
            type="range"
            name="max"
            min={cmc.min}
            max={20}
            id="max"
            value={cmc.max}
            onChange={updateFilters}
          />
        </Container>
      </Flex>
    </FilterBox>
  </FilterContainer>
)

export const Filter = ({ stats, updateFilters, filters }) => {
  const isMobile = useMediaQuery({ maxWidth: 1100 })
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
            Filters
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
