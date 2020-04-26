import React, { useState } from 'react'
import styled from 'styled-components'
import { ThemeProvider, Flex, Button, Text, Container } from 'warlock-ui'
import { ManaSymbol } from '../ManaSymbol'

const cardColors = {
  W: { color: 'warmGrey', shade: 2 },
  U: { color: 'blueVivid', shade: 4 },
  B: { color: 'grey', shade: 7 },
  G: { color: 'greenVivid', shade: 3 },
  R: { color: 'redVivid', shade: 3 },
  A: { color: 'blueGrey', shade: 2 },
  M: { color: 'yellowVivid', shade: 4 },
}

const buildCardColors = (theme, colors) => {
  let backgroundColor = []

  if (colors.length === 0) {
    backgroundColor.push(
      `${theme.color[cardColors['A'].color][cardColors['A'].shade]}`
    )
    backgroundColor.push(
      `${theme.color[cardColors['A'].color][cardColors['A'].shade + 2]}`
    )
  } else if (colors.length >= 3) {
    backgroundColor.push(
      `${theme.color[cardColors['M'].color][cardColors['M'].shade]}`
    )
    backgroundColor.push(
      `${theme.color[cardColors['M'].color][cardColors['M'].shade + 2]}`
    )
  } else {
    colors.forEach((color, i) => {
      backgroundColor.push(
        `${theme.color[cardColors[color].color][cardColors[color].shade]}`
      )
      backgroundColor.push(
        `${theme.color[cardColors[color].color][cardColors[color].shade + 3]}`
      )
    })
  }

  return `linear-gradient(to bottom right, ${backgroundColor.join(', ')})`
}

const CardContainer = styled.div(({ theme, color }) => {
  const backgroundColors = buildCardColors(theme, color)

  return {
    padding: theme.spaceScale(2),
    width: theme.spaceScale(13),
    background: backgroundColors,
    borderRadius: theme.spaceScale(2),
  }
})

Button.Left = styled(Button)`
  border-radius: 1rem 0 0 1rem;
  background-color: transparent;
`
Button.Middle = styled.div`
  border-radius: 0;
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.color['grey'][8]};
  display: inline-block;
  text-align: center;
  padding: ${({ theme }) =>
    [theme.spaceScale(1), theme.spaceScale(2)].join(' ')};
`
Button.Right = styled(Button)`
  border-radius: ${({ theme, hasCard }) =>
    hasCard ? '0 1rem 1rem 0' : theme.spaceScale(1)};
  background-color: transparent;
`

Button.Info = styled(Button)`
  background-color: transparent;
`

const InnerCard = styled.div`
  background-color: hsl(0, 100%, 100%, 0.7);
  border-radius: ${({ theme }) => theme.spaceScale(2)};
  padding: ${({ theme }) => theme.spaceScale(1)};
`

const CardInfo = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const TitleText = styled(Text)`
  width: 100%;
`

export const Card = ({ actions, deckScope, ...rest }) => {
  const [card, setCard] = useState({ ...rest })
  const [showText, setShowText] = useState(false)
  const deckId = deckScope && deckScope.id

  const { add, update, remove } = actions

  const addCard = () => {
    add(id, setCard, deckId)
  }

  const removeCard = () => {
    remove(id, setCard, deckId)
  }

  const updateCard = newQuantity => {
    if (newQuantity === 0) {
      removeCard()
    } else {
      update(id, setCard, newQuantity, deckId)
    }
  }

  const {
    card_type,
    color_identity,
    id,
    mana_cost,
    name,
    power,
    rarity,
    text,
    toughness,
  } = card

  const cardScope = card.deck ? 'deck' : 'collection'

  const { has_card, quantity } = card[cardScope]

  const formatedMana = mana_cost
    .replace(/[{ | }]/g, ' ')
    .replace(/\//g, '')
    .split(' ')
    .filter(Boolean)

  return (
    <ThemeProvider>
      <CardContainer color={color_identity} showText={showText}>
        <InnerCard>
          <Flex justifyContent="space-between" alignItems="start">
            <Container width={[7]}>
              <Flex alignItems="center" justifyContent="start">
                {formatedMana.length !== 0 &&
                  formatedMana.map((mana, i) => (
                    <ManaSymbol key={i} mana={mana} />
                  ))}
              </Flex>
            </Container>
            <div>
              {has_card && (
                <>
                  <Button.Left
                    color="grey"
                    shade={8}
                    size="small"
                    variant="outline"
                    bubble={false}
                    isDisabled={!has_card}
                    onClick={() => {
                      const newQuantity = quantity - 1
                      if (newQuantity === 0) {
                        removeCard()
                      } else {
                        updateCard(quantity - 1)
                      }
                    }}
                  >
                    -
                  </Button.Left>
                  <Button.Middle
                    color="grey"
                    shade={8}
                    variant="outline"
                    isDisabled
                  >
                    {has_card && quantity}
                  </Button.Middle>
                </>
              )}
              <Button.Right
                hasCard={has_card}
                color="grey"
                shade={8}
                size="small"
                bubble={false}
                variant="outline"
                onClick={() =>
                  has_card ? updateCard(quantity + 1) : addCard()
                }
              >
                +
              </Button.Right>
            </div>
          </Flex>
          <CardInfo>
            <TitleText title={name} weight="400" family="Roboto" color="black">
              {name}
            </TitleText>
          </CardInfo>
          <CardInfo>
            <Text
              size={2}
              family="Source Sans"
              shade={1}
              color="black"
              title={card_type}
            >
              {card_type}
            </Text>
          </CardInfo>
          <Flex justifyContent="space-between" alignItems="end">
            <Text
              isItalics
              size={1}
              alignSelf="center"
              family="Source Sans"
              color="black"
              isUpcase
            >
              {rarity}
            </Text>
            {power && toughness && (
              <Text
                size={4}
                alignSelf="center"
                family="Source Sans"
                color="black"
              >
                {power} / {toughness}
              </Text>
            )}
            <Button.Info
              color="grey"
              shade={10}
              size="small"
              variant="outline"
              bubble={false}
              onClick={() => setShowText(!showText)}
            >
              More
            </Button.Info>
          </Flex>
          {showText && (
            <>
              <hr />
              <Text size={2} color="black" shade={1} family="Source Sans">
                {text}
              </Text>
            </>
          )}
        </InnerCard>
      </CardContainer>
    </ThemeProvider>
  )
}

// TODO Add more filters
// TODO Add Card for Land
