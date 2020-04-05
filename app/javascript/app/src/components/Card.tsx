import React, { useState } from 'react'
import styled from 'styled-components'
import { ThemeProvider, Flex, Button, Text, Container } from 'warlock-ui'
import fetch from 'cross-fetch'
import { ManaSymbol } from './ManaSymbol'

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
    color: color === 'B' ? 'white' : 'black',
    background: backgroundColors,
    borderRadius: theme.spaceScale(2),
  }
})

const InnerCard = styled.div`
  background-color: hsl(0, 100%, 100%, 0.6);
  border-radius: ${({ theme }) => theme.spaceScale(2)};
  padding: ${({ theme }) => theme.spaceScale(2)};
`

const CardInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const TitleText = styled(Text)`
  width: 100%;
`

const StyledMana = styled.div(({ theme }) => ({
  width: theme.spaceScale(5),
  height: theme.spaceScale(5),
  margin: `${theme.spaceScale(2)} 0`,
}))

export const Card = cardInfo => {
  const [card, setCard] = useState(cardInfo)
  const [showOptions, setShowOptions] = useState(false)

  const {
    artist,
    border_color,
    card_set_id,
    card_type,
    card_types,
    color_identity,
    converted_mana_cost,
    flavor_text,
    id,
    mana_cost,
    name,
    number,
    original_text,
    power,
    prices,
    rarity,
    rulings,
    text,
    toughness,
    uuid,
    has_card,
    quantity,
    ...rest
  } = card

  const addToCollection = async () => {
    try {
      const response = await fetch(`/api/v1/add_card/${id}`, {
        method: 'POST',
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setCard(data)
    } catch (error) {
      console.log('Unable to add card to collection', console.error)
    }
  }

  const removeFromCollection = async () => {
    try {
      const response = await fetch(`/api/v1/remove_card/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setCard(data)
    } catch (error) {
      console.log('Unable to remove card to collection', console.error)
    }
  }

  const updateCollectionQuantity = async newQuantity => {
    if (newQuantity === 0) {
      return removeFromCollection()
    }

    try {
      const response = await fetch(
        `/api/v1/add_card/${id}?quantity=${newQuantity}`,
        {
          method: 'PUT',
        }
      )

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setCard(data)
    } catch (error) {
      console.log('Unable to remove card to collection', console.error)
    }
  }

  const formatedMana = mana_cost
    .replace(/[{ | }]/g, ' ')
    .replace(/\//g, '')
    .split(' ')
    .filter(Boolean)

  // let rarityColor = 'black'
  // switch (rarity) {
  //   case 'uncommon':
  //     rarityColor = 'silver'
  //     break
  //   case 'rare':
  //     rarityColor = 'gold'
  //     break
  //   case 'mythic':
  //     rarityColor = theme.color['orangeVivid'][6]
  //     break
  //   default:
  //     rarityColor = 'black'
  //     break
  // }

  return (
    <ThemeProvider>
      <CardContainer
        color={color_identity}
        onClick={() => !showOptions && setShowOptions(true)}
      >
        <InnerCard>
          <Flex justifyContent="space-between" alignItems="center">
            <Container width="7rem">
              <Flex alignItems="center" justifyContent="start">
                {formatedMana.length !== 0 &&
                  formatedMana.map(mana => <ManaSymbol mana={mana} />)}
              </Flex>
            </Container>
            {power && toughness && (
              <Text size={4} family="Source Sans" color="black" shade={1}>
                {power} / {toughness}
              </Text>
            )}
          </Flex>
          <CardInfo>
            <TitleText isBold family="Roboto" color="black" shade={1}>
              {name}
            </TitleText>
          </CardInfo>
          <CardInfo>
            <Text
              isItalics
              size={2}
              family="Source Sans"
              shade={1}
              color="black"
            >
              {card_type}
            </Text>
          </CardInfo>
          {showOptions && (
            <>
              <hr />
              <Text size={2} color="black" shade={1} family="Source Sans">
                {text}
              </Text>
            </>
          )}
          <Flex justifyContent="space-between" alignItems="center">
            <Button
              color="grey"
              shade={8}
              size="small"
              bubble={false}
              variant="text"
              onClick={() =>
                has_card
                  ? updateCollectionQuantity(quantity + 1)
                  : addToCollection()
              }
            >
              Add
            </Button>
            <Button
              color="grey"
              shade={8}
              size="small"
              variant="text"
              bubble={false}
              isDisabled={!has_card}
              onClick={() => updateCollectionQuantity(quantity - 1)}
            >
              Remove
            </Button>
            <Button
              color="grey"
              shade={8}
              size="small"
              variant="text"
              bubble={false}
              onClick={() => setShowOptions(false)}
            >
              Hide
            </Button>
          </Flex>
        </InnerCard>
      </CardContainer>
    </ThemeProvider>
  )
}
