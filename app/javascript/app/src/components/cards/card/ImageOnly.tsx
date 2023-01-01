import React, { useState, useEffect, ReactElement } from 'react'
import styled from 'styled-components'
import { Button, usePopupTrigger, FlipCard, Flex } from 'warlock-ui'
import { ActionButtons } from '../../buttons'
import { getCard, useDebounce } from '../../../utils'
import { CardModal } from './CardModal'
import { Feather } from '../../icon'
import { Card } from '../../../interface'
import { useToasts } from '../../../providers'
import { Price } from '../../prices'

const CardContainer = styled.div(({ theme }) => ({
  backgroundColor: 'transparent',
  width: '16rem',
  borderRadius: theme.spaceScale(4),
  display: 'flex',
  flexDirection: 'column',
}))

const OptionContainer = styled.div(({ theme }) => ({
  backgroundColor: 'transparent',
  width: '16rem',
  padding: `${theme.spaceScale(1)} 0`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}))

const CardImgContainer = styled.div(({ theme }) => ({
  height: '22rem',
  overflow: 'hidden',
  borderRadius: theme.spaceScale(4),
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

Button.Icon = styled(Button)`
  border-radius: ${({ theme }): string => theme.spaceScale(1)};
  background-color: transparent;
`

interface Add {
  (id: number, options?: any): Promise<Card>
}
interface Update {
  (id: number, quantity: number, options?: any): Promise<Card>
}
interface Remove {
  (id: number, options?: any): Promise<Card>
}

interface CardActions {
  add: Add
  update: Update
  remove: Remove
}

interface Props {
  actions: CardActions
  card: Card
  deckId?: number
  options?: any
}

export const ImageOnly = ({
  actions,
  card,
  options = {},
}: Props): ReactElement => {
  const [isLoading, setIsLoading] = useState(true)
  const [cardImages, setCardImages] = useState([])
  const [prevQuantity, setPrevQuantity] = useState(null)
  const [cardPrices, setCardPrices] = useState({})

  const currentScope = options && options.deckId ? 'deck' : 'collection'
  const cardCounts = card[currentScope] || { quantity: 0, foil: 0 }
  const [quantity, setQuantity] = useState(cardCounts.quantity)
  const [foilQuantity, setFoilQuantity] = useState(cardCounts.foil)
  const [cardOptions, setCardOptions] = useState(options)

  const debouncedValue = useDebounce(quantity)
  const modal = usePopupTrigger()

  const { addToast } = useToasts()

  const { id, name, scryfallId } = card

  const { add, update, remove } = actions

  const addCard = (options?: any): void => {
    setPrevQuantity(quantity)
    setQuantity(1)

    // Adds options if present
    if (options) {
      setCardOptions(options)
    }

    // Adds foil quantity if present in options
    if (options && options.params && options.params.foil) {
      setFoilQuantity(1)
    }
  }

  const updateCard = (newQuantity: number, options?: any): void => {
    setPrevQuantity(quantity)
    setQuantity(newQuantity)

    // There can never be more foils than total quantity.
    // This ensures the user gets current information when updating counts
    if (foilQuantity > newQuantity) {
      setFoilQuantity(newQuantity)
    }

    if (options) {
      setCardOptions(options)
    }

    if (options && options.params && options.params.foil !== undefined) {
      setFoilQuantity(options.params.foil)
    }
  }

  const removeCard = (options?: any): void => {
    setPrevQuantity(quantity)
    setQuantity(0)

    if (options) {
      setCardOptions(options)
    }

    if (options && options.params && options.params.foil) {
      setFoilQuantity(0)
    }
  }
  // Updates the card quantity on the db
  const updateCardQuantity = async (): Promise<void> => {
    if (prevQuantity === 0 && quantity === 1) {
      await add(id, cardOptions)
      addToast(
        `${name} added to ${(options && options.deckId && options.name) ||
          'Collection'}`
      )
    } else if (quantity <= 0) {
      await remove(id, cardOptions)
      addToast(
        `${name} was removed from ${(options &&
          options.deckId &&
          options.name) ||
          'Collection'}`,
        {
          appearance: 'info',
        }
      )
    } else if (prevQuantity !== quantity) {
      await update(id, quantity, cardOptions)
      addToast(
        `${name} quantity updated to ${quantity} in ${(options &&
          options.deckId &&
          options.name) ||
          'Collection'}`,
        {
          appearance: 'info',
        }
      )
    }
  }

  const getCardImage = (cardData, size: string): void => {
    const images = []

    // Card has single face and image uris
    if (cardData.imageUris && cardData.imageUris[size]) {
      images.push(cardData.imageUris[size])
      // Card has multiple faces
    } else if (cardData.cardFaces) {
      cardData.cardFaces.forEach(cardFace => {
        if (cardFace.imageUris && cardFace.imageUris[size]) {
          images.push(cardFace.imageUris[size])
        }
      })
    }

    setCardImages(images)
  }

  const handleCardImage = async () => {
    const cardData = await getCard(scryfallId)

    // Set card images
    getCardImage(cardData, 'normal')

    // Set card Price
    setCardPrices(cardData && cardData.prices)
  }

  useEffect(() => {
    handleCardImage()
  }, [])

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
    <>
      <CardModal
        popupProps={...modal.popup}
        isOpen={modal.isOpen}
        quantity={quantity}
        foilQuantity={foilQuantity}
        cardActions={{ updateCard, removeCard, addCard }}
        cardProps={...card}
      />
      <CardContainer>
        <OptionContainer>
          <Button.Icon color="purple" shade={1} {...modal.trigger}>
            <Feather
              svgProps={{
                'stroke-width': 2,
              }}
              icon="info"
              size="small"
            />
          </Button.Icon>
          <ActionButtons
            quantity={quantity}
            actions={{ updateCard, removeCard, addCard }}
          />
        </OptionContainer>
        <CardImagesContainer>
          {cardImages && cardImages.length && cardImages.length === 1 ? (
            <CardImgContainer>
              <CardImg src={cardImages[0]} alt={name} />
            </CardImgContainer>
          ) : (
            <FlipCard>
              <FlipCard.Front isPaddingless style={{ position: 'relative' }}>
                <CardImgContainer>
                  <CardImg src={cardImages[0]} alt={name} />
                </CardImgContainer>
              </FlipCard.Front>
              <FlipCard.Back isPaddingless>
                <CardImgContainer>
                  <CardImg src={cardImages[1]} alt={name} />
                </CardImgContainer>
              </FlipCard.Back>
            </FlipCard>
          )}
        </CardImagesContainer>
        <Flex alignItems="center" justifyContent="space-between">
          {cardPrices && cardPrices.usd ? (
            <Price label="Normal" price={cardPrices && cardPrices.usd} />
          ) : null}
          {cardPrices && cardPrices.usdFoil ? (
            <Price label="Foil" price={cardPrices && cardPrices.usdFoil} />
          ) : null}
        </Flex>
      </CardContainer>
    </>
  )
}
