import React, { ReactElement, useState, useEffect } from 'react'
import { Page, Full } from '../components'
import {
  getCard as getScryfallCard,
  getCardImage,
  collectionCardActions,
} from '../utils'
import { Card as CardInterface } from '../interface'

const defaultCard: CardInterface = {
  isAlternative: false,
  isPromo: false,
  id: 0,
  name: '',
  colorIdentity: '',
  scryfallId: '',
  manaCost: '',
  power: 0,
  toughness: 0,
  cardType: '',
  artist: '',
  rulings: [],
  legalities: [],
  flavorText: '',
  text: '',
  number: 0,
  rarity: '',
  collection: { quantity: 0, foil: 0 },
  variations: [],
  convertedManaCost: 0,
  loyalty: '',
  borderColor: '',
  tcgplayerProductId: 0,
  frameEffects: [],
  setCode: '',
}

interface Props {
  id: number
}

export const Card = ({ id }: Props): ReactElement => {
  const [card, setCard] = useState(defaultCard)
  const [images, setImages] = useState([])
  const [variations, setVariations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [prices, setPrices] = useState({
    usd: 0,
    usdFoil: 0,
  })

  const getVariationInfo = async (card: CardInterface): Promise<void> => {
    let newVariations = card.variations
    if (newVariations) {
      newVariations = await Promise.all(
        card.variations.map(async variant => ({
          ...variant,
          imgUrl: await getCardImage(variant.scryfallId, 'large'),
        }))
      )
    }

    setVariations(newVariations)
  }

  const initialize = async (): Promise<void> => {
    const newCard: CardInterface = await collectionCardActions.card(id)
    const scryfallId = newCard && newCard.scryfallId

    getVariationInfo(newCard)
    setCard(newCard)
    setIsLoading(false)

    if (scryfallId) {
      const scryfallCard = await getScryfallCard(scryfallId)
      const cardImgs = await getCardImage(scryfallId, 'large')

      setImages(cardImgs)
      setPrices(scryfallCard.prices)
    }
  }

  useEffect(() => {
    if (isLoading) {
      initialize()
    }
  }, [isLoading])

  return (
    <Page>
      {isLoading ? (
        <h1>...Loading</h1>
      ) : (
        <Full
          card={card}
          img={images}
          variations={variations}
          prices={prices}
          setCard={updatedCard => setCard(updatedCard)}
        />
      )}
    </Page>
  )
}
