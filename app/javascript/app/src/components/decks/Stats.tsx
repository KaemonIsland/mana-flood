import React, { useState, ReactElement } from 'react'
import styled from 'styled-components'
import { ThemeProvider, Text, Flex, Grid, Button } from 'warlock-ui'
import { useMediaQuery } from 'react-responsive'
import { Collapse } from '../collapse'
import { CardStats } from '../../interface'

const StatsTitle = styled.div`
  padding: 0 ${({ theme }): string => theme.spaceScale(4)};
  border-bottom: 2px solid ${({ theme }): string => theme.color.grey[8]};
  text-transform: uppercase;
  font-family: Roboto, sans-serif;
  display: flex;
  align-items: center;
  justify-content: space-between;
`
const StatsPair = styled.div`
  padding: 0 ${({ theme }): string => theme.spaceScale(4)};
  margin: ${({ theme }): string => theme.spaceScale(1)};
  text-transform: capitalize;
  font-family: Roboto, sans-serif;
  font-size: ${({ theme }): string => theme.fontScale(2)};
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const StyledRamp = styled.div(() => ({
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

interface StatsProps {
  stats: CardStats
}
export const Stats = ({ stats }: StatsProps): ReactElement => {
  const [showStats, setShowStats] = useState(false)
  const isMobile = useMediaQuery({ maxWidth: 950 })
  const { cmc, colors, types, counts, rarity, cards } = stats

  // Calculates the average mana cost by total cards
  const averageCost = (
    Object.entries(cmc).reduce(
      (curr, acc) => curr + Number(acc[0]) * acc[1],
      0
    ) / cards
  ).toFixed(2)

  // Adds a leading zero if cmc is less than 10
  const formatNumber = (num: number): string =>
    num <= 9 ? `0${num}` : `${num}`

  const maxCmcCards = Math.max(...Object.values(cmc))

  return (
    <ThemeProvider>
      <Collapse isOpen={showStats} color="purple" shade={3}>
        <Collapse.Header>
          <Flex alignItems="center" justifyContent="space-between">
            <Button
              variant="outline"
              color="purple"
              shade={8}
              onClick={(): void => setShowStats(!showStats)}
              type="button"
            >
              View Stats
            </Button>
          </Flex>
        </Collapse.Header>
        <Collapse.Content>
          <Grid
            columnGap={6}
            templateAreas={
              isMobile
                ? [
                    'ramp',
                    'info',
                    'color',
                    'type',
                    'land',
                    'rarity',
                    'creature',
                  ]
                : ['ramp info color creature', 'type land rarity creature']
            }
            templateColumns={isMobile ? Grid.fr(1) : Grid.repeat(4, Grid.fr(1))}
            templateRows={
              isMobile ? Grid.repeat(7, Grid.fr(1)) : Grid.repeat(2, Grid.fr(1))
            }
          >
            <Grid.Item area="info">
              <StyledGridItem>
                <Flex alignItems="start" isColumn>
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
                  <div>Avg: {averageCost || 0}</div>
                </StatsTitle>
                <RampContainer>
                  {[1, 2, 3, 4, 5, 6].map(manaCost => (
                    <StyledRamp key={manaCost}>
                      <Text size={2} family="roboto">
                        {manaCost} {manaCost === 1 && '-'}{' '}
                        {manaCost === 6 && '+'}
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
                  Object.entries(types.creature.subtypes).map(
                    ([type, count]) => (
                      <StatsPair key={type}>
                        <div>{type}</div>
                        <div>{count}</div>
                      </StatsPair>
                    )
                  )}
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
                    <StatsPair key={land}>
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
                  <StatsPair key={rare}>
                    <div>{rare}</div>
                    <div>{count}</div>
                  </StatsPair>
                ))}
              </StyledGridItem>
            </Grid.Item>
          </Grid>
        </Collapse.Content>
      </Collapse>
    </ThemeProvider>
  )
}
