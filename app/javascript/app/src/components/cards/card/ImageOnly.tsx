import React, { useState, useEffect, ReactElement } from 'react'
import styled from 'styled-components'
import { Button } from 'warlock-ui'
import { ActionButtons } from '../../buttons'
import { getCardImage, useDebounce } from '../../../utils'
import { Link } from '../../link'
import { Feather } from '../../icon'
import { Card } from '../../../interface'
import { useToasts } from '../../../providers'

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

export const ImageOnly = ({ actions, card }: Props): ReactElement => {
  const [isLoading, setIsLoading] = useState(true)
  const [cardImages, setCardImages] = useState([])
  const scope = card && card.deck >= 0 ? 'deck' : 'collection'
  const [prevQuantity, setPrevQuantity] = useState(null)
  const [quantity, setQuantity] = useState(card[scope])

  const debouncedValue = useDebounce(quantity)

  const { addToast } = useToasts()

  const { id, name, scryfallId } = card

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
      addToast(`${name} added to collection`)
    } else if (quantity <= 0) {
      await remove(id)
      addToast(`${name} was removed from collection`, {
        appearance: 'info',
      })
    } else {
      await update(id, quantity)
      addToast(`${name} quantity updated to ${quantity}`, {
        appearance: 'info',
      })
    }
  }

  const handleCardImage = async () => {
    const cardUrl = await getCardImage(scryfallId, 'normal', name)
    setCardImages(cardUrl)
  }

  useEffect(() => {
    setQuantity(card[scope])
  }, [card[scope]])

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
    <CardContainer>
      <OptionContainer>
        <Link href={`/card/${id}`}>
          <Button.Icon color="purple" shade={1}>
            <Feather icon="info" size="small" />
          </Button.Icon>
        </Link>
        <ActionButtons
          collection={scope === 'deck' ? card?.collection : null}
          quantity={quantity}
          actions={{ updateCard, removeCard, addCard }}
        />
      </OptionContainer>
      <CardImagesContainer>
        {cardImages.length &&
          cardImages.map((cardImg, index) => (
            <CardImgContainer key={index}>
              <CardImg src={cardImg} alt={name} />
            </CardImgContainer>
          ))}
      </CardImagesContainer>
    </CardContainer>
  )
}
