import React, { useState } from 'react'
import styled from 'styled-components'
import { ThemeProvider, Text, Flex, Grid, Button } from 'warlock-ui'
import { useCardsStats } from '../../utils'

const StatsContainer = styled.section(({ theme, showStats }) => ({
  padding: `0 ${theme.spaceScale(4)}`,
  backgroundColor: theme.color.purple[3],
  borderBottom: `1px solid ${theme.color.purple[8]}`,
  height: showStats ? '100%' : '6rem',
  maxHeight: '100%',
  overflow: 'hidden',
  transition: 'all 300ms ease-in-out',
}))

const StatsHeader = styled.div(({ theme }) => ({
  margin: theme.spaceScale(4),
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
  padding: theme.spaceScale(4),
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

const StyledGridItem = styled.div(({ theme }) => ({
  padding: theme.spaceScale(2),
  backgroundColor: theme.color.purple[2],
  borderRadius: theme.spaceScale(2),
  boxShadow: theme.boxShadow.single[2],
}))

export const Stats = ({ cards, name, format }) => {
  const [showStats, setShowStats] = useState(false)
  const {
    average,
    cmc,
    colors,
    counts,
    types,
    rarity,
    ...stats
  } = useCardsStats(cards, 'deck')

  // Adds a leading zero if cmc is less than 10
  const formatNumber = (num: number): string =>
    num <= 9 ? `0${num}` : `${num}`

  const maxCmcCards = Math.max(...Object.values(cmc))

  return (
    <ThemeProvider>
      <StatsContainer showStats={showStats}>
        <StatsHeader>
          <Flex alignItems="center" justifyContent="space-between">
            <div>
              <Text family="roboto" size={7}>
                {name}
              </Text>
              <Text>
                {format} {stats.cards >= 60 ? 'Legal' : 'Illegal'} {stats.cards}
                /60
              </Text>
            </div>
            <Button
              variant="outline"
              color="purple"
              shade={8}
              onClick={() => setShowStats(!showStats)}
              type="button"
            >
              View Stats
            </Button>
          </Flex>
        </StatsHeader>
        <Grid
          columnGap={6}
          templateAreas={[
            'ramp info color creature',
            'type land rarity creature',
          ]}
          templateColumns={Grid.repeat(4, Grid.fr(1))}
          templateRows={Grid.repeat(2, Grid.fr(1))}
        >
          <Grid.Item area="info">
            <StyledGridItem>
              <Flex alignItems="start" direction="column">
                <p>Mana Ratio</p>
                <ColorBar {...colors} total={colors.total} />
                <p>Land Ratio</p>
                <ColorBar
                  W={types.land.subtypes['plains'] || 0}
                  U={types.land.subtypes['island'] || 0}
                  B={types.land.subtypes['swamp'] || 0}
                  R={types.land.subtypes['mountain'] || 0}
                  G={types.land.subtypes['forest'] || 0}
                  total={counts.land}
                />
              </Flex>
            </StyledGridItem>
          </Grid.Item>

          <Grid.Item area="ramp">
            <StyledGridItem>
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
            </StyledGridItem>
          </Grid.Item>
          <Grid.Item area="color">
            <StyledGridItem>
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
            </StyledGridItem>
          </Grid.Item>
          <Grid.Item area="type">
            <StyledGridItem>
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
            </StyledGridItem>
          </Grid.Item>
          <Grid.Item area="creature">
            <StyledGridItem>
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
            </StyledGridItem>
          </Grid.Item>
          <Grid.Item area="land">
            <StyledGridItem>
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
            </StyledGridItem>
          </Grid.Item>
          <Grid.Item area="rarity">
            <StyledGridItem>
              <StatsTitle>
                <div>Rarity</div>
              </StatsTitle>

              {Object.entries(rarity).map(([rare, count]) => (
                <StatsPair>
                  <div>{rare}</div>
                  <div>{count}</div>
                </StatsPair>
              ))}
            </StyledGridItem>
          </Grid.Item>
        </Grid>
      </StatsContainer>
    </ThemeProvider>
  )
}
