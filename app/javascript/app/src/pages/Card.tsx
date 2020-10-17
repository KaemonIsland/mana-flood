import React, { ReactElement, useState, useEffect } from 'react'
import { Page, Full } from '../components'
import { getCard as getScryfallCard, getCardImage, cardActions } from '../utils'
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
  legalities: {},
  flavorText: '',
  text: '',
  number: 0,
  rarity: '',
  collection: 0,
  variations: [],
  convertedManaCost: 0,
  loyalty: '',
  borderColor: '',
  tcgplayerProductId: 0,
}

interface Props {
  id: number
}

export const Card = ({ id }: Props): ReactElement => {
  const [card, setCard] = useState(defaultCard)
  const [img, setImg] = useState('')
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
          imgUrl: await getCardImage(variant.scryfallId, 'large', card.name),
        }))
      )
    }

    setVariations(newVariations)
  }

  const initialize = async (): Promise<void> => {
    const newCard: CardInterface = await cardActions.collection.card(id)
    const scryfallCard = await getScryfallCard(newCard.scryfallId)

    const cardUrl = scryfallCard.imageUris && scryfallCard.imageUris.large

    getVariationInfo(newCard)

    setCard(newCard)
    setImg(cardUrl)
    setPrices(scryfallCard.prices)

    setIsLoading(false)
  }

  useEffect(() => {
    initialize()
  }, [])

  return (
    <Page>
      {isLoading ? (
        <h1>...Loading</h1>
      ) : (
        <Full
          card={card}
          img={img}
          variations={variations}
          prices={prices}
          setCard={updatedCard => setCard(updatedCard)}
        />
      )}
    </Page>
  )
}
