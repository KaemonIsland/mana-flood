import React, { useState, useEffect, ReactElement } from 'react'
import styled from 'styled-components'
import {
  ThemeProvider,
  Flex,
  Button,
  Text,
  Modal,
  usePopupTrigger,
} from 'warlock-ui'
import { Link } from '../../link'
import { ActionButtons } from '../../buttons'
import { AddCardForm } from '../../forms'
import { ManaSymbol, Feather } from '../../icon'
import {
  getCardImage,
  getManaCost,
  uniqueColors,
  useDebounce,
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
      if (cardColors[color]) {
        backgroundColor.push(
          `${theme.color[cardColors[color].color][cardColors[color].shade]}`
        )
        backgroundColor.push(
          `${theme.color[cardColors[color].color][cardColors[color].shade + 3]}`
        )
      }
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

const CardContainer = styled.div(({ theme, color = [] }) => {
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

// Frame Effect Symbols
const frameEffectIcon = {
  showcase: 'star',
  extendedart: 'square',
  inverted: 'rotate-cw',
}

export const Minimal = ({ actions, card }: Props): ReactElement => {
  const [isLoading, setIsLoading] = useState(true)
  const [cardImages, setCardImages] = useState([])
  const scope = card && card.deck >= 0 ? 'deck' : 'collection'
  const [prevQuantity, setPrevQuantity] = useState(null)
  const [quantity, setQuantity] = useState(card[scope])
  const debouncedValue = useDebounce(quantity)

  const { addToast } = useToasts()

  const modal = usePopupTrigger()

  const {
    cardType,
    id,
    manaCost,
    name,
    colorIdentity,
    scryfallId,
    frameEffects,
  } = card

  const cardName = String(name).split(' // ')[0]

  const isLand = cardType.includes('Land')

  // Grabs the first frame effect for a card if it exists
  const frameEffect = frameEffects[0] || ''

  // Determines if the card is a PROMO if the first promo type is boosterfun
  const isPromo =
    card &&
    card.promoTypes &&
    card.promoTypes.length &&
    card.promoTypes[0] === 'boosterfun'

  const { add, update, remove } = actions

  const addCard = (): void => {
    setPrevQuantity(quantity)
    setQuantity(1)
  }

  const updateCard = (newQuantity: number): void => {
    setPrevQuantity(quantity)
    setQuantity(newQuantity)
  }

  const removeCard = (): void => {
    setPrevQuantity(quantity)
    setQuantity(0)
  }

  // Updates the card quantity on the db
  const updateCardQuantity = async (): Promise<void> => {
    if (prevQuantity === 0 && quantity === 1) {
      await add(id)
      addToast(`${cardName} added to collection`)
    } else if (quantity <= 0) {
      await remove(id)
      addToast(`${cardName} was removed from collection`, {
        appearance: 'info',
      })
    } else {
      await update(id, quantity)
      addToast(`${cardName} quantity updated to ${quantity}`, {
        appearance: 'info',
      })
    }
  }

  // Mana without brackets
  const formattedMana = getManaCost(manaCost)

  // Unique mana colors for card theming
  const cardColors = uniqueColors(formattedMana)

  const handleCardImage = async () => {
    const cardUrl = await getCardImage(scryfallId, 'normal', name)
    setCardImages(cardUrl)
  }

  // Fetches a new card image whenever the card viewer is opened
  useEffect(() => {
    if (modal.isOpen && !cardImages.length) {
      handleCardImage()
    }
  }, [modal.isOpen])

  // Uses debounce to update card toasts and quantities
  useEffect(() => {
    if (!isLoading) {
      updateCardQuantity()
    }
  }, [debouncedValue])

  // Sets loading to false after everything is done... loading
  useEffect(() => {
    setIsLoading(false)
  }, [])

  return (
    <ThemeProvider>
      <Modal {...modal.popup}>
        <Flex alignItems="end" justifyContent="space-between">
          <CardImagesContainer>
            {cardImages.length
              ? cardImages.map((cardImage, index) => (
                  <CardImgContainer key={index}>
                    <CardImg src={cardImage} alt={name} />
                  </CardImgContainer>
                ))
              : null}
          </CardImagesContainer>
          <div>
            <AddCardForm
              collection={scope === 'deck' ? card?.collection : null}
              quantity={quantity}
              actions={{ updateCard, removeCard, addCard }}
            />
          </div>
        </Flex>
      </Modal>
      <div>
        <CardContainer color={isLand ? colorIdentity : cardColors}>
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
              <Button.Icon color="purple" shade={1} {...modal.trigger}>
                <Feather
                  svgProps={{
                    'stroke-width': 2,
                  }}
                  icon="info"
                  size="small"
                />
              </Button.Icon>
              {isPromo && frameEffectIcon[frameEffect] ? (
                <p title={frameEffect}>
                  <Feather
                    svgProps={{
                      'stroke-width': 1,
                    }}
                    icon={frameEffectIcon[frameEffect]}
                    size="small"
                  />
                </p>
              ) : null}
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
      </div>
    </ThemeProvider>
  )
}
