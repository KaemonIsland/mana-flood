import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { ThemeProvider, Text, Flex, Grid } from 'warlock-ui'
import { Cards } from '../cards'
import { useCards, useDeckStats } from '../../utils'

const StatsContainer = styled.section(({ theme }) => ({
  padding: theme.spaceScale(4),
  backgroundColor: theme.color.purple[3],
  borderBottom: `1px solid ${theme.color.purple[8]}`,
}))

const StatsTitle = styled.div`
  padding: 0 ${({ theme }) => theme.spaceScale(4)};
  border-bottom: 2px solid ${({ theme }) => theme.color.grey[8]};
  text-transform: uppercase;
  font-family: Roboto, sans-serif;
  display: flex;
  align-items: center;
  justify-content: space-between;
`
const StatsPair = styled.div`
  padding: 0 ${({ theme }) => theme.spaceScale(4)};
  margin: ${({ theme }) => theme.spaceScale(1)};
  text-transform: capitalize;
  font-family: Roboto, sans-serif;
  font-size: ${({ theme }) => theme.fontScale(2)};
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const StyledRamp = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column-reverse',
  alignItems: 'center',
  justifyContent: 'center',
}))

const RampContainer = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `0 ${theme.spaceScale(4)}`,
}))

const ColorBar = styled.div(({ theme, W, U, B, R, G, total }) => {
  const white = +((W / total) * 100).toFixed(0)
  const blue = +((U / total) * 100).toFixed(0)
  const black = +((B / total) * 100).toFixed(0)
  const red = +((R / total) * 100).toFixed(0)
  const green = +((G / total) * 100).toFixed(0)
  return {
    padding: `0 ${theme.spaceScale(4)}`,
    height: theme.spaceScale(5),
    width: '100%',
    borderRadius: theme.spaceScale(2),
    backgroundImage: `linear-gradient(90deg,
    ${theme.color.warmGrey[4]} ${white}%,
    ${theme.color.blueVivid[6]} ${white}%,
    ${theme.color.blueVivid[6]} ${blue + white}%,
    ${theme.color.grey[9]} ${blue + white}%,
    ${theme.color.grey[9]} ${blue + white + black}%,
    ${theme.color.redVivid[5]} ${blue + white + black}%,
    ${theme.color.redVivid[5]} ${blue + white + black + red}%,
    ${theme.color.greenVivid[5]} ${blue + white + black + red}%,
    ${theme.color.greenVivid[5]} ${blue + white + black + red + green}%,
    ${theme.color.blueGrey[4]} ${blue + white + black + red + green}%,
    ${theme.color.blueGrey[4]} 100%)`,
  }
})

const StyledMeter = styled.div(({ theme, value }) => ({
  width: theme.spaceScale(5),
  height: theme.spaceScale(10),
  border: `1px solid ${theme.color.purple[8]}`,
  margin: theme.spaceScale(1),
  borderRadius: theme.spaceScale(2),
  backgroundImage: `linear-gradient(360deg,
    ${theme.color.greenVivid[4]} ${value}%,
    ${theme.color.grey[3]} ${value}%,
    ${theme.color.grey[3]} 100%)`,
}))

export const Deck = ({ name, format, updated_at, id }) => {
  const [cards, setCards] = useState([])
  const {
    average,
    cmc,
    colors,
    counts,
    types,
    rarity,
    isLegal,
    ...stats
  } = useDeckStats(cards, format)
  const { actions } = useCards(name)

  console.log(colors)

  // Adds a leading zero if cmc is less than 10
  const formatNumber = (num: number): string =>
    num <= 9 ? `0${num}` : `${num}`

  const maxCmcCards = Math.max(...Object.values(cmc))

  // Card Crud actions

  const { get, add, update, remove } = actions

  const addCard = cardId => add(cardId, id)

  const removeCard = async cardId => {
    remove(cardId, id)

    setCards(sortCards(cards.filter(card => card.id !== cardId)))
  }

  const updateCard = async (cardId, newQuantity) => {
    const updatedCard = await update(cardId, newQuantity, id)

    const otherCards = cards.filter(card => card.id !== updatedCard.id)

    setCards(sortCards([...otherCards, updatedCard]))
  }

  // Card Sorting

  const sortAlpha = (a, b) => {
    const cardA = a.name.toUpperCase()
    const cardB = b.name.toUpperCase()

    if (cardA > cardB) {
      return 1
    } else if (cardB > cardA) {
      return -1
    } else {
      return 0
    }
  }

  // Filters out variations
  const filterVariation = cards => {
    let variants = []

    const filteredCards = cards.filter(card => {
      if (card.variations) {
        card.variations.forEach(variant => variants.push(variant))
      }

      return !variants.includes(card.uuid)
    })

    return filteredCards
  }

  const sortCards = cards => filterVariation(cards).sort(sortAlpha)

  const getDeckCards = async () => {
    const cards = await get(id)
    const filteredCards = filterVariation(cards).sort(sortAlpha)
    setCards(filteredCards)
  }

  useEffect(() => {
    getDeckCards()
  }, [])

  return (
    <ThemeProvider>
      <StatsContainer>
        <Grid
          columnGap={6}
          templateAreas={[
            'info ramp color creature',
            'type land rarity creature',
          ]}
          templateColumns={Grid.repeat(4, Grid.fr(1))}
          templateRows={Grid.repeat(2, Grid.fr(1))}
        >
          <Grid.Item area="info">
            <Flex alignItems="start" direction="column">
              <Text family="roboto" size={8}>
                {name} {stats.cards}
              </Text>
              <Text>
                {format} {isLegal ? 'Legal' : 'Illegal'}
              </Text>
              <p>Mana</p>
              <ColorBar {...colors} total={colors.total} />
              <p>Land</p>
              <ColorBar
                W={types.land.subtypes['plains'] || 0}
                U={types.land.subtypes['island'] || 0}
                B={types.land.subtypes['swamp'] || 0}
                R={types.land.subtypes['mountain'] || 0}
                G={types.land.subtypes['forest'] || 0}
                total={counts.land}
              />
            </Flex>
          </Grid.Item>

          <Grid.Item area="ramp">
            <StatsTitle>
              <div>Ramp</div>
              <div>Avg: {average}</div>
            </StatsTitle>
            <RampContainer>
              {[1, 2, 3, 4, 5, 6].map(manaCost => (
                <StyledRamp>
                  <Text size={2} family="roboto">
                    {manaCost} {manaCost === 1 && '-'} {manaCost === 6 && '+'}
                  </Text>
                  <StyledMeter
                    value={Math.round(
                      (Number(cmc[manaCost]) / maxCmcCards) * 100
                    )}
                  />
                  <Text size={2} family="roboto">
                    {formatNumber(cmc[manaCost])}
                  </Text>
                </StyledRamp>
              ))}
            </RampContainer>
          </Grid.Item>
          <Grid.Item area="color">
            <StatsTitle>
              <div>Color</div>
            </StatsTitle>
            {Object.entries(colors).map(([color, count]) => {
              const colorNames = {
                W: 'white',
                U: 'blue',
                B: 'black',
                R: 'red',
                G: 'green',
                C: 'colorless',
                M: 'multi',
              }
              return (
                !!count &&
                color !== 'total' && (
                  <StatsPair>
                    <div>{colorNames[color]}</div>
                    <div>{((count / colors.total) * 100).toFixed(0)}%</div>
                  </StatsPair>
                )
              )
            })}
          </Grid.Item>
          <Grid.Item area="type">
            <StatsTitle>
              <div>Types</div>
            </StatsTitle>
            {Object.entries(types).map(
              ([type, typeObj]) =>
                !!typeObj.count && (
                  <StatsPair>
                    <div>{type}</div>
                    <div>{typeObj.count}</div>
                  </StatsPair>
                )
            )}
          </Grid.Item>
          <Grid.Item area="creature">
            <StatsTitle>
              <div>Creatures</div>
              <div>{types.creature.count}</div>
            </StatsTitle>

            {types.creature.subtypes &&
              Object.entries(types.creature.subtypes).map(([type, count]) => (
                <StatsPair>
                  <div>{type}</div>
                  <div>{count}</div>
                </StatsPair>
              ))}
          </Grid.Item>
          <Grid.Item area="land">
            <StatsTitle>
              <div>Land</div>
              <div>{types.land.count}</div>
            </StatsTitle>

            {types.land.subtypes &&
              Object.entries(types.land.subtypes).map(([land, count]) => (
                <StatsPair>
                  <div>{land}</div>
                  <div>{count}</div>
                </StatsPair>
              ))}
          </Grid.Item>
          <Grid.Item area="rarity">
            <StatsTitle>
              <div>Rarity</div>
            </StatsTitle>

            {Object.entries(rarity).map(([rare, count]) => (
              <StatsPair>
                <div>{rare}</div>
                <div>{count}</div>
              </StatsPair>
            ))}
          </Grid.Item>
        </Grid>
      </StatsContainer>
      <Cards actions={{ addCard, updateCard, removeCard }} cards={cards} />
    </ThemeProvider>
  )
}
