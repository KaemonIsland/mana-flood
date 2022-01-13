import React, { useState, useEffect, ReactElement } from 'react'
import styled from 'styled-components'
import { Flex, Text, Modal, FlipCard, Container, Grid } from 'warlock-ui'
import { AddCardForm } from '../../forms'
import { getCard } from '../../../utils'
import { Prices } from '../../prices'

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
  const [cardPrices, setCardPrices] = useState({})

  const { scryfallId, locations } = cardProps

  const inCollection = locations.filter(
    location => location.type === 'collection'
  )[0]

  const inDecks = locations.filter(location => location.type === 'deck')

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

  const handleFetchCard = async (): Promise<void> => {
    const cardData = await getCard(scryfallId)

    // Set card images
    getCardImage(cardData, 'normal')

    // Set card Price
    setCardPrices(cardData && cardData.prices)
  }

  // Fetches a new card image whenever the card viewer is opened
  useEffect(() => {
    if (isOpen && !cardImages.length) {
      handleFetchCard()
    }
  }, [isOpen])

  return (
    <Modal {...popupProps}>
      <Container width="90vw">
        <Grid
          templateColumns={Grid.repeat(2, Grid.fr(1))}
          gap={2}
          templateRows={Grid.repeat(2, Grid.fr(1))}
          templateAreas={['image price', 'image form']}
        >
          <Grid.Item area="image">
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
          </Grid.Item>
          <Grid.Item area="price">
            <Container width="100%">
              <Prices
                prices={[
                  { label: 'Normal', price: cardPrices && cardPrices.usd },
                  { label: 'Foil', price: cardPrices && cardPrices.usdFoil },
                  {
                    label: 'Foil Etched',
                    price: cardPrices && cardPrices.usdFoilEtched,
                  },
                ]}
              />
            </Container>
          </Grid.Item>
          <Grid.Item area="form" alignSelf="end">
            <Container width="100%">
              <AddCardForm
                quantity={quantity}
                foil={foilQuantity}
                actions={...cardActions}
              />
            </Container>
          </Grid.Item>
        </Grid>
        <div>
          {inCollection ? (
            <>
              <hr />
              <Flex alignItems="center" justifyContent="space-between">
                <h6>Collection</h6>
                <Text size={7} isBold style={{ width: 'auto' }}>
                  {inCollection.quantity}
                  <Text
                    size={7}
                    as="span"
                    color="coolGrey"
                    display="inline"
                    shade={4}
                  >
                    ({inCollection.foil})
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
      </Container>
    </Modal>
  )
}
