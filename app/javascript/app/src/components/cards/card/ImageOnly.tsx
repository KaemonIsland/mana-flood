import React, { ReactElement } from 'react'
import styled from 'styled-components'
import { Button, usePopupTrigger, FlipCard, Flex } from 'warlock-ui'
import { ActionButtons } from '../../buttons'
import { useCard } from '../../../utils'
import { Feather } from '../../icon'
import { Card } from '../../../interface'
import { Price } from '../../prices'
import { CardModal } from './CardModal'

const CardContainer = styled.div(({ theme }) => ({
  backgroundColor: 'transparent',
  width: '14.5rem',
  borderRadius: theme.spaceScale(4),
  display: 'flex',
  flexDirection: 'column',
}))

const OptionContainer = styled.div(({ theme }) => ({
  backgroundColor: 'transparent',
  width: '14.5rem',
  paddingBottom: theme.spaceScale(1),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}))

const CardImgContainer = styled.div(({ theme }) => ({
  height: '20rem',
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

interface Props {
  card: Card
  deckId?: number
  options?: any
}

export const ImageOnly = ({ card, options = {} }: Props): ReactElement => {
  const deckId = (options && options.deckId) || null
  const { name } = card
  const { images, prices, deck, collection } = useCard(card, deckId, options)
  const modal = usePopupTrigger()

  return (
    <>
      <CardModal
        popupProps={...modal.popup}
        isOpen={modal.isOpen}
        quantity={deckId ? deck.quantity : collection.quantity}
        foilQuantity={deckId ? deck.foilQuantity : collection.foilQuantity}
        cardActions={deckId ? deck.actions : collection.actions}
        cardProps={...card}
        isDeck={Boolean(deckId)}
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
            quantity={deckId ? deck.quantity : collection.quantity}
            actions={deckId ? deck.actions : collection.actions}
          />
        </OptionContainer>
        <CardImagesContainer>
          {images && images.length && images.length === 1 ? (
            <CardImgContainer>
              <CardImg src={images[0]} alt={name} />
            </CardImgContainer>
          ) : (
            <FlipCard>
              <FlipCard.Front isPaddingless style={{ position: 'relative' }}>
                <CardImgContainer>
                  <CardImg src={images[0]} alt={name} />
                </CardImgContainer>
              </FlipCard.Front>
              <FlipCard.Back isPaddingless>
                <CardImgContainer>
                  <CardImg src={images[1]} alt={name} />
                </CardImgContainer>
              </FlipCard.Back>
            </FlipCard>
          )}
        </CardImagesContainer>
        <Flex alignItems="center" justifyContent="space-between">
          {prices && prices.usd ? (
            <Price label="Normal" price={prices && prices.usd} />
          ) : null}
          {prices && prices.usdFoil ? (
            <Price label="Foil" price={prices && prices.usdFoil} />
          ) : null}
        </Flex>
      </CardContainer>
    </>
  )
}
