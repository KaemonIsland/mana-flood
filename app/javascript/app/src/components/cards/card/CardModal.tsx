import React, { useState, useEffect, ReactElement } from 'react'
import styled from 'styled-components'
import { Flex, Text, Modal, FlipCard } from 'warlock-ui'
import { AddCardForm } from '../../forms'
import { getCardImage } from '../../../utils'

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

const FlexDeckContainer = styled.div(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
}))

interface CardProps {
  name: string
  scryfallId: string
  locations: Array<any>
}

interface CardModalProps {
  popupProps: any
  isOpen: boolean
  quantity: number
  foilQuantity: number
  cardActions: any
  cardProps: CardProps
}

/**
 * A Modal component for extra card interactions.
 * Used to add remove foiled cards and to view the cards current usage.
 *
 * @param popupProps - Props necessary for a accessible modal component
 * @param isOpen - Props to tell if model is open
 * @param quantity - The card quantity for the current scope
 * @param foilQuantity - The card foil quantity for the current scope
 * @param cardActions - CRUD actions for the card
 * @param cardProps - Props like name, id, and locations
 *
 * @returns {function} A react component
 */
export const CardModal = ({
  popupProps,
  isOpen,
  quantity,
  foilQuantity,
  cardActions,
  cardProps,
}: CardModalProps): ReactElement => {
  const [cardImages, setCardImages] = useState([])

  const { name, scryfallId, locations } = cardProps

  const inCollection = locations.filter(
    location => location.type === 'collection'
  )
  const inDecks = locations.filter(location => location.type === 'deck')

  const handleCardImage = async (): Promise<void> => {
    const cardUrl = await getCardImage(scryfallId, 'normal', name)
    setCardImages(cardUrl)
  }

  // Fetches a new card image whenever the card viewer is opened
  useEffect(() => {
    if (isOpen && !cardImages.length) {
      handleCardImage()
    }
  }, [isOpen])

  return (
    <Modal {...popupProps}>
      <Flex
        alignItems="end"
        justifyContent="space-between"
        style={{ width: '90vw' }}
      >
        <CardImagesContainer>
          {cardImages.length && cardImages.length === 1 ? (
            <CardImgContainer>
              <CardImg src={cardImages[0]} alt={name} />
            </CardImgContainer>
          ) : (
            <FlipCard>
              <FlipCard.Front style={{ position: 'relative' }}>
                <CardImgContainer>
                  <CardImg src={cardImages[0]} alt={name} />
                </CardImgContainer>
              </FlipCard.Front>
              <FlipCard.Back>
                <CardImgContainer>
                  <CardImg src={cardImages[1]} alt={name} />
                </CardImgContainer>
              </FlipCard.Back>
            </FlipCard>
          )}
        </CardImagesContainer>
        <div>
          <AddCardForm
            quantity={quantity}
            foil={foilQuantity}
            actions={...cardActions}
          />
        </div>
      </Flex>
      <div>
        {inCollection.length ? (
          <>
            <hr />
            <Flex alignItems="center" justifyContent="space-between">
              <h6>Collection</h6>
              <Text size={7} isBold style={{ width: 'auto' }}>
                {inCollection[0].quantity}
                <Text
                  size={7}
                  as="span"
                  color="coolGrey"
                  display="inline"
                  shade={4}
                >
                  ({inCollection[0].foil})
                </Text>
              </Text>
            </Flex>
          </>
        ) : null}
        {inDecks.length ? (
          <>
            <hr />
            <Flex isColumn>
              {inDecks.map(inDeck => (
                <FlexDeckContainer key={inDeck.deckId}>
                  <div>
                    <Text isBold>{inDeck.name}</Text>
                    <Text size={2} isItalics>
                      {inDeck.format}
                    </Text>
                  </div>
                  <div>
                    <Text size={7} isBold style={{ width: 'auto' }}>
                      {inDeck.quantity}
                      <Text
                        size={7}
                        as="span"
                        color="coolGrey"
                        display="inline"
                        shade={4}
                      >
                        ({inDeck.foil})
                      </Text>
                    </Text>
                  </div>
                </FlexDeckContainer>
              ))}
            </Flex>
          </>
        ) : null}
      </div>
    </Modal>
  )
}
