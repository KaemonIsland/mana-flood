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

const StyledRamp = styled.div(({ theme }) => ({
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'start',
  margin: theme.spaceScale(1),
}))

const StyledMeter = styled.div(({ theme, value }) => ({
  width: theme.spaceScale(12),
  height: theme.spaceScale(5),
  border: `1px solid ${theme.color.purple[8]}`,
  margin: theme.spaceScale(1),
  borderRadius: theme.spaceScale(2),
  backgroundImage: `linear-gradient(90deg,
    ${theme.color.greenVivid[4]} ${value}%,
    ${theme.color.grey[3]} ${value}%,
    ${theme.color.grey[3]} 100%)`,
}))

export const Deck = ({ name, format, updated_at, id }) => {
  const [cards, setCards] = useState([])
  const stats = useDeckStats(cards)
  const { actions } = useCards(name)

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

  console.dir(stats)

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
          templateAreas={['info creature count', 'ramp spell land']}
          templateColumns={Grid.repeat(3, Grid.fr(1))}
          templateRows={Grid.repeat(2, Grid.fr(1))}
        >
          <Grid.Item area="info">
            <Flex alignItems="start" direction="column">
              <Text family="roboto" size={8}>
                {name}
              </Text>
              <Text>{format}</Text>
            </Flex>
          </Grid.Item>

          <Grid.Item area="ramp">
            <StyledRamp>
              <Text display="inline-block" family="roboto">
                01
              </Text>
              <StyledMeter
                value={Math.round((Number(stats.cmc['1']) / stats.cards) * 100)}
              />
              <Text display="inline-block" family="roboto">
                {stats.cmc['1']}
              </Text>
            </StyledRamp>
            <StyledRamp>
              <Text display="inline-block" family="roboto">
                02
              </Text>
              <StyledMeter
                value={Math.round((Number(stats.cmc['2']) / stats.cards) * 100)}
                max={stats.cards}
                title="2 converted mana cost"
              />
              <Text display="inline-block" family="roboto">
                {stats.cmc['2']}
              </Text>
            </StyledRamp>
            <StyledRamp>
              <Text display="inline-block" family="roboto">
                03
              </Text>
              <StyledMeter
                value={Math.round((Number(stats.cmc['3']) / stats.cards) * 100)}
                max={stats.cards}
                title="3 converted mana cost"
              />
              <Text display="inline-block" family="roboto">
                {stats.cmc['3']}
              </Text>
            </StyledRamp>
            <StyledRamp>
              <Text display="inline-block" family="roboto">
                04
              </Text>
              <StyledMeter
                value={Math.round((Number(stats.cmc['4']) / stats.cards) * 100)}
                max={stats.cards}
                title="4 converted mana cost"
              />
              <Text display="inline-block" family="roboto">
                {stats.cmc['4']}
              </Text>
            </StyledRamp>
            <StyledRamp>
              <Text display="inline-block" family="roboto">
                05
              </Text>
              <StyledMeter
                value={Math.round((Number(stats.cmc['5']) / stats.cards) * 100)}
                max={stats.cards}
                title="5 converted mana cost"
              />
              <Text display="inline-block" family="roboto">
                {stats.cmc['5']}
              </Text>
            </StyledRamp>
            <StyledRamp>
              <Text display="inline-block" family="roboto">
                06
              </Text>
              <StyledMeter
                value={Math.round((Number(stats.cmc['6']) / stats.cards) * 100)}
                max={stats.cards}
                title="6 or more converted mana cost"
              />
              <Text display="inline-block" family="roboto">
                {stats.cmc['6']}
              </Text>
            </StyledRamp>
          </Grid.Item>
          <Grid.Item area="count">Count</Grid.Item>
          <Grid.Item area="creature">Creature</Grid.Item>
          <Grid.Item area="spell">Spell</Grid.Item>
          <Grid.Item area="land">Land</Grid.Item>
        </Grid>
      </StatsContainer>
      <Cards actions={{ addCard, updateCard, removeCard }} cards={cards} />
    </ThemeProvider>
  )
}
