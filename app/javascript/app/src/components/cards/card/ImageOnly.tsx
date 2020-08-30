import React, { useState, useEffect, ReactElement } from 'react'
import styled from 'styled-components'
import { Button, Flex } from 'warlock-ui'
import { ActionButtons } from '../../buttons'
import { getCardImage } from '../../../utils'
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
  const [cardImg, setCardImg] = useState('')
  const scope = card && card.deck >= 0 ? 'deck' : 'collection'
  const [quantity, setQuantity] = useState(card[scope])

  const { addToast } = useToasts()

  const { id, name, scryfallId } = card

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

  const handleCardImage = async () => {
    const cardUrl = await getCardImage(scryfallId, 'normal')
    setCardImg(cardUrl)
  }

  useEffect(() => {
    setQuantity(card[scope])
  }, [card[scope]])

  useEffect(() => {
    handleCardImage()
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
          quantity={quantity}
          actions={{ updateCard, removeCard, addCard }}
        />
      </OptionContainer>
      <CardImgContainer>
        <CardImg src={cardImg} alt={name} />
      </CardImgContainer>
    </CardContainer>
  )
}
