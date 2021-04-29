import React, { useState, useEffect, ReactElement } from 'react'
import styled from 'styled-components'
import { ThemeProvider, Flex, Button, Text, Container } from 'warlock-ui'
import { Link } from '../../link'
import { ActionButtons } from '../../buttons'
import { ManaSymbol, Feather } from '../../icon'
import { Dropdown } from '../../Dropdown'
import {
  useDropdown,
  getCardImage,
  getManaCost,
  uniqueColors,
} from '../../../utils'
import { Card } from '../../../interface'
import { useToasts } from '../../../providers'

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
 * @param {set} colors - A, array of cards colors. We use a set to prevent duplicates
 *
 * @returns formatted linear-gradient string used for a css background
 */
const buildCardColors = (theme, colors: Array<string>): string => {
  const backgroundColor = []

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

const CardImagesContainer = styled.div(() => ({
  display: 'flex',
  alignItems: 'center',
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
    width: '22rem',
    background: backgroundColors,
    borderRadius: theme.spaceScale(2),
    boxShadow: theme.boxShadow.single[2],
  }
})

Button.Icon = styled(Button)`
  border-radius: ${({ theme }): string => theme.spaceScale(1)};
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
  const [cardImages, setCardImages] = useState([])
  const scope = card && card.deck >= 0 ? 'deck' : 'collection'
  const [quantity, setQuantity] = useState(card[scope])
  // Info used for displaying the card image
  const { dropdownProps, triggerProps, isOpen } = useDropdown()

  const { addToast } = useToasts()

  const { cardType, id, manaCost, name, colorIdentity, scryfallId } = card

  const cardName = String(name).split(' // ')[0]

  const isLand = cardType.includes('Land')

  const { add, update, remove } = actions

  const addCard = async (): Promise<void> => {
    await add(id)
    addToast(`${cardName} added to collection`)
    setQuantity(1)
  }

  const updateCard = async (quantity: number): Promise<void> => {
    await update(id, quantity)
    addToast(`${cardName} quantity updated to ${quantity}`, {
      appearance: 'info',
    })
    setQuantity(quantity)
  }

  const removeCard = async (): Promise<void> => {
    await remove(id)
    addToast(`${cardName} was removed from collection`, { appearance: 'info' })
    setQuantity(0)
  }

  // Mana without brackets
  const formattedMana = getManaCost(manaCost)

  // Unique mana colors for card theming
  const cardColors = uniqueColors(formattedMana)

  const handleCardImage = async () => {
    const cardUrl = await getCardImage(scryfallId, 'normal', name)
    setCardImages(cardUrl)
  }

  useEffect(() => {
    setQuantity(card[scope])
  }, [card[scope]])

  useEffect(() => {
    if (isOpen) {
      handleCardImage()
    }
  }, [isOpen])

  return (
    <ThemeProvider>
      <div>
        <CardContainer
          ref={triggerProps.ref}
          color={isLand ? colorIdentity : cardColors}
        >
          <InnerCard>
            <Flex justifyContent="space-between" alignItems="space-between">
              <Link href={`/card/${id}`}>
                <CardInfo>
                  <TitleText
                    title={cardName}
                    weight="500"
                    spacing={1.1}
                    family="Roboto"
                    color="black"
                  >
                    {cardName}
                  </TitleText>
                </CardInfo>
              </Link>
              <Flex alignItems="center" justifyContent="end">
                {formattedMana.length !== 0 &&
                  formattedMana.map((mana, i) => (
                    <ManaSymbol size="small" key={i} mana={mana} />
                  ))}
              </Flex>
            </Flex>
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
            <Flex alignItems="flex-end" justifyContent="space-between">
              <Button.Icon color="purple" shade={1} {...triggerProps}>
                <Feather
                  svgProps={{
                    'stroke-width': 1,
                  }}
                  icon={`eye${isOpen ? '-off' : ''}`}
                  size="small"
                />
              </Button.Icon>
              <div>
                <ActionButtons
                  collection={scope === 'deck' ? card?.collection : null}
                  quantity={quantity}
                  actions={{ updateCard, removeCard, addCard }}
                />
              </div>
            </Flex>
          </InnerCard>
        </CardContainer>
        <Dropdown isPaddingless {...dropdownProps}>
          <CardImagesContainer>
            {cardImages.length
              ? cardImages.map((cardImage, index) => (
                  <CardImgContainer key={index}>
                    <CardImg src={cardImage} alt={name} />
                  </CardImgContainer>
                ))
              : null}
          </CardImagesContainer>
        </Dropdown>
      </div>
    </ThemeProvider>
  )
}
