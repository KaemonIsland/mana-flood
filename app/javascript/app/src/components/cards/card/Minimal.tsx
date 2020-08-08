import React, { useState, useEffect, ReactElement } from 'react'
import styled from 'styled-components'
import { ThemeProvider, Flex, Button, Text, Container } from 'warlock-ui'
import { Link } from '../../link'
import { ActionButtons } from '../../buttons'
import { ManaSymbol, Feather } from '../../icon'
import { Dropdown } from '../../Dropdown'
import { useDropdown, getCardImage } from '../../../utils'
import { Card } from '../../../interface'
import { useToasts } from '../../toast'

// Card border colors
const cardColors = {
  W: { color: 'warmGrey', shade: 2 },
  U: { color: 'blueVivid', shade: 4 },
  B: { color: 'grey', shade: 7 },
  G: { color: 'greenVivid', shade: 3 },
  R: { color: 'redVivid', shade: 3 },
  A: { color: 'blueGrey', shade: 2 },
  C: { color: 'blueGrey', shade: 2 },
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
const buildCardColors = (theme, colors: Set<string>): string => {
  const backgroundColor = []

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
const CardImg = styled.img(() => ({
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
  border: 1px solid ${({ theme }): string => theme.color['grey'][8]};
  display: inline-block;
  text-align: center;
  padding: ${({ theme }): string =>
    [theme.spaceScale(1), theme.spaceScale(2)].join(' ')};
`
Button.Right = styled(Button)`
  border-radius: ${({ theme, hasCard }): string =>
    hasCard ? '0 1rem 1rem 0' : theme.spaceScale(1)};
  background-color: transparent;
`

const InnerCard = styled.div`
  background-color: hsl(0, 100%, 100%, 0.7);
  border-radius: ${({ theme }): string => theme.spaceScale(2)};
  padding: ${({ theme }): string => theme.spaceScale(2)};
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

interface Add {
  (id: number): Promise<Card>
}
interface Update {
  (id: number, quantity: number): Promise<Card>
}
interface Remove {
  (id: number): Promise<Card>
}

interface CardActions {
  add: Add
  update: Update
  remove: Remove
}

interface Props {
  actions: CardActions
  card: Card
}

export const Minimal = ({ actions, card }: Props): ReactElement => {
  const [timeoutId, setTimeoutId] = useState(null)
  const [cardImg, setCardImg] = useState('')
  const scope = card && card.deck ? 'deck' : 'collection'
  const [quantity, setQuantity] = useState(card[scope])
  // Info used for displaying the card image
  const { dropdownProps, triggerProps, open, close, isOpen } = useDropdown()

  const { addToast } = useToasts()

  const {
    cardType,
    id,
    manaCost,
    name,
    power,
    toughness,
    colorIdentity,
    scryfallId,
  } = card

  const isLand = cardType.includes('Land')

  const { add, update, remove } = actions

  const addCard = async (): Promise<void> => {
    await add(id)
    addToast(`${name} added to collection`)
    setQuantity(1)
  }

  const updateCard = async (quantity: number): Promise<void> => {
    await update(id, quantity)
    addToast(`${name} quantity updated to ${quantity}`, { appearance: 'info' })
    setQuantity(quantity)
  }

  const removeCard = async (): Promise<void> => {
    await remove(id)
    addToast(`${name} was removed from collection`, { appearance: 'info' })
    setQuantity(0)
  }

  // Starts a timeout that will fetch the card img after a set time
  const startTimeout = (): void => {
    if (isOpen) {
      return
    }

    const timeoutId = setTimeout(async () => {
      const cardUrl = await getCardImage(scryfallId, 'normal')
      setCardImg(cardUrl)
      open()
    }, 300)

    setTimeoutId(timeoutId)
  }

  // Clears the active timeout if it's set
  const stopTimeout = (): void => {
    timeoutId && clearTimeout(timeoutId)
    close()
  }

  // Formats the cards mana cost for us to easily use mana symbol SVGs
  const formattedMana: Array<string> = manaCost
    .replace(/[{ | }]/g, ' ')
    .replace(/\//g, '')
    .split(' ')
    .filter(Boolean)

  // Further changes the formatted mana to generate the cards colors in mana order
  // A set is used to prevent duplicates
  const cardColors: Set<string> = new Set(
    formattedMana
      .filter(char => isNaN(Number(char)) && char !== 'X')
      .map(char => (char.length >= 2 && char.split('')) || char)
      .flat()
      .filter(Boolean)
  )

  useEffect(() => {
    setQuantity(card[scope])
  }, [card[scope]])

  return (
    <ThemeProvider>
      <div>
        <CardContainer
          color={isLand ? new Set(colorIdentity) : cardColors}
          {...triggerProps}
          onClick={(): void => {
            // TODO Add functionality here
          }}
          onMouseEnter={startTimeout}
          onMouseLeave={stopTimeout}
        >
          <InnerCard>
            <Flex justifyContent="space-between" alignItems="start">
              <Container width={[7]}>
                <Flex alignItems="center" justifyContent="start">
                  {formattedMana.length !== 0 &&
                    formattedMana.map((mana, i) => (
                      <ManaSymbol size="small" key={i} mana={mana} />
                    ))}
                </Flex>
              </Container>
              <div>
                <ActionButtons
                  quantity={quantity}
                  actions={{ updateCard, removeCard, addCard }}
                />
              </div>
            </Flex>
            <Flex alignItems="flex-end" justifyContent="space-between">
              <Link href={`/card/${id}`}>
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
                    title={cardType}
                  >
                    {cardType}
                  </Text>
                </CardInfo>
              </Link>
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
        <Dropdown
          isPaddingless
          isOpen={Boolean(isOpen && cardImg)}
          {...dropdownProps}
        >
          <CardImgContainer>
            <CardImg src={cardImg} alt={name} />
          </CardImgContainer>
        </Dropdown>
      </div>
    </ThemeProvider>
  )
}
