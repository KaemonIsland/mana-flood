import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { ThemeProvider, Flex, Button, Text, Container, Image } from 'warlock-ui'
import { ManaSymbol } from '../ManaSymbol'
import { Dropdown } from '../Dropdown'
import { useDropdown, getCardImage } from '../../utils'

// Card border colors
const cardColors = {
  W: { color: 'warmGrey', shade: 2 },
  U: { color: 'blueVivid', shade: 4 },
  B: { color: 'grey', shade: 7 },
  G: { color: 'greenVivid', shade: 3 },
  R: { color: 'redVivid', shade: 3 },
  A: { color: 'blueGrey', shade: 2 },
  M: { color: 'yellowVivid', shade: 4 },
}

/**
 * Builds a linear gradient based off of the card colors
 *
 * @param {object} theme - the theme used for styled-components
 * @param {set} colors - A set of cards colors. We use a set to prevent duplicates
 *
 * @returns formatted linear-gradient string used for a css background
 */
const buildCardColors = (theme, colors) => {
  let backgroundColor = []

  // We use use size because colors is a set
  if (colors.size === 0) {
    backgroundColor.push(
      `${theme.color[cardColors['A'].color][cardColors['A'].shade]}`
    )
    backgroundColor.push(
      `${theme.color[cardColors['A'].color][cardColors['A'].shade + 2]}`
    )
  } else if (colors.size >= 3) {
    backgroundColor.push(
      `${theme.color[cardColors['M'].color][cardColors['M'].shade]}`
    )
    backgroundColor.push(
      `${theme.color[cardColors['M'].color][cardColors['M'].shade + 2]}`
    )
  } else {
    colors.forEach(color => {
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

const CardImgContainer = styled.div(({ theme }) => ({
  zIndex: 100,
  width: '16rem',
  height: '22rem',
  borderRadius: theme.spaceScale(4),
  overflow: 'hidden',
  boxShadow: theme.boxShadow.single[2],
}))
const CardImg = styled.img(({ theme }) => ({
  maxWidth: '100%',
  width: '100%',
  height: '100%',
}))

const CardContainer = styled.div(({ theme, color }) => {
  const backgroundColors = buildCardColors(theme, color)

  return {
    padding: theme.spaceScale(1),
    width: '20rem',
    background: backgroundColors,
    borderRadius: theme.spaceScale(2),
    boxShadow: theme.boxShadow.single[2],
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

const InnerCard = styled.div`
  background-color: hsl(0, 100%, 100%, 0.7);
  border-radius: ${({ theme }) => theme.spaceScale(2)};
  padding: ${({ theme }) => theme.spaceScale(2)};
`

const CardInfo = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 15rem;
`

const TitleText = styled(Text)`
  width: 100%;
`

export const Card = ({ actions, ...card }) => {
  const [timeoutId, setTimeoutId] = useState(null)
  const [cardImg, setCardImg] = useState('')
  const scope = card.deck ? 'deck' : 'collection'
  const [hasCard, setHasCard] = useState(card[scope].has_card)
  const [quantity, setQuantity] = useState(card[scope].quantity)
  // Info used for displaying the card image
  const { dropdownProps, triggerProps, open, close, isOpen } = useDropdown()

  const {
    card_type,
    id,
    mana_cost,
    name,
    power,
    toughness,
    color_identity,
    scryfall_id,
  } = card

  const isLand = card_type.includes('Land')

  const { addCard, updateCard, removeCard } = actions

  // Starts a timeout that will fetch the card img after a set time
  const startTimeout = () => {
    if (isOpen) {
      return
    }

    const timeoutId = setTimeout(async () => {
      const cardUrl = await getCardImage(scryfall_id)
      setCardImg(cardUrl)
      open()
    }, 300)

    setTimeoutId(timeoutId)
  }

  // Clears the active timeout if it's set
  const stopTimeout = () => {
    timeoutId && clearTimeout(timeoutId)
    close()
  }

  // Formats the cards mana cost for us to easily use mana symbol svgs
  const formattedMana = mana_cost
    .replace(/[{ | }]/g, ' ')
    .replace(/\//g, '')
    .split(' ')
    .filter(Boolean)

  // Further changes the formatted mana to generate the cards colors in mana order
  // A set is used to prevent duplicates
  const cardColors = new Set(
    formattedMana
      .filter(char => isNaN(Number(char)) && char !== 'X')
      .map(char => (char.length >= 2 && char.split('')) || char)
      .flat()
  )

  useEffect(() => {
    setHasCard(card[scope].has_card)
    setQuantity(card[scope].quantity)
  }, [card[scope]])

  return (
    <ThemeProvider>
      <div>
        <CardContainer
          color={isLand ? new Set(color_identity) : cardColors}
          {...triggerProps}
          onClick={() => {}}
          onMouseEnter={startTimeout}
          onMouseLeave={stopTimeout}
        >
          <InnerCard>
            <Flex justifyContent="space-between" alignItems="start">
              <Container width={[7]}>
                <Flex alignItems="center" justifyContent="start">
                  {formattedMana.length !== 0 &&
                    formattedMana.map((mana, i) => (
                      <ManaSymbol key={i} mana={mana} />
                    ))}
                </Flex>
              </Container>
              <div>
                <Flex alignItems="center">
                  {hasCard && (
                    <>
                      <Button.Left
                        color="grey"
                        shade={8}
                        size="small"
                        variant="outline"
                        bubble={false}
                        isDisabled={!hasCard}
                        onClick={() => {
                          const newQuantity = quantity - 1
                          if (newQuantity) {
                            updateCard(id, newQuantity)
                            setQuantity(newQuantity)
                          } else {
                            removeCard(id)
                            setHasCard(false)
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
                        {hasCard && quantity}
                      </Button.Middle>
                    </>
                  )}
                  <Button.Right
                    hasCard={hasCard}
                    color="grey"
                    shade={8}
                    size="small"
                    bubble={false}
                    variant="outline"
                    onClick={() => {
                      if (hasCard) {
                        updateCard(id, quantity + 1)
                        setQuantity(quantity + 1)
                      } else {
                        addCard(id)
                        setHasCard(true)
                      }
                    }}
                  >
                    +
                  </Button.Right>
                </Flex>
              </div>
            </Flex>
            <Flex alignItems="flex-end" justifyContent="space-between">
              <div>
                <CardInfo>
                  <TitleText
                    title={name}
                    weight="400"
                    family="Roboto"
                    color="black"
                  >
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
              </div>
              {power && toughness && (
                <CardInfo>
                  <Text size={4} family="Roboto" color="black">
                    {power} / {toughness}
                  </Text>
                </CardInfo>
              )}
            </Flex>
          </InnerCard>
        </CardContainer>
        <Dropdown isPaddingless {...dropdownProps} isOpen={isOpen && cardImg}>
          <CardImgContainer>
            <CardImg src={cardImg} alt={name} />
          </CardImgContainer>
        </Dropdown>
      </div>
    </ThemeProvider>
  )
}
