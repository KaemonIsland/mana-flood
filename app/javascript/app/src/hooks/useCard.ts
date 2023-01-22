import { useState, useEffect } from 'react'
import { getCard, useCardActions } from '../utils'
import { Card } from '../interface'
import { useToasts } from '../providers'

interface UseCardReturn {
  isLoading: boolean
  images: Array<string>
  prices: any
  deck: {
    quantity: number
    foilQuantity: number
    categories: Array<any>
    actions: {
      add: (options: any) => void
      update: (newQuantity: number, options: any) => void
      remove: () => void
    }
  }
  collection: {
    quantity: number
    foilQuantity: number
    actions: {
      add: (options: any) => void
      update: (newQuantity: number, options: any) => void
      remove: () => void
    }
  }
}

export const useCard = (
  card: Card,
  deckId?: number,
  options?: any
): UseCardReturn => {
  const [isLoading, setIsLoading] = useState(true)

  const [images, setImages] = useState([])
  const [prices, setPrices] = useState({})

  // Collection related values
  const [collectionQuantity, setCollectionQuantity] = useState(
    card?.collection?.quantity || 0
  )
  const [prevCollectionQuantity, setPrevCollectionQuantity] = useState(null)
  const [foilCollectionQuantity, setFoilCollectionQuantity] = useState(
    card?.collection?.foil || 0
  )

  // Deck related values
  const [deckQuantity, setDeckQuantity] = useState(card?.deck?.quantity || 0)
  const [prevDeckQuantity, setPrevDeckQuantity] = useState(null)
  const [foilDeckQuantity, setFoilDeckQuantity] = useState(
    card?.deck?.foil || 0
  )
  const [categories, setCategories] = useState(card.categories || [])

  const { add, update, remove } = useCardActions()
  const { id, name, scryfallId } = card
  const { addToast } = useToasts()

  // DECK RELATED ACTIONS!
  const addDeckCard = (options?: any): void => {
    setPrevDeckQuantity(deckQuantity)
    setDeckQuantity(1)

    // Adds foil quantity if present in options
    if (options && options.foil) {
      setFoilDeckQuantity(1)
    }
  }

  const updateDeckCard = (newQuantity: number, options?: any): void => {
    setPrevDeckQuantity(deckQuantity)
    setDeckQuantity(newQuantity)

    // There can never be more foils than total quantity.
    // This ensures the user gets current information when updating counts
    if (foilDeckQuantity > newQuantity) {
      setFoilDeckQuantity(newQuantity)
    }

    if (options && options.foil !== undefined) {
      setFoilDeckQuantity(options.foil)
    }

    if (options && options.categories !== undefined) {
      setCategories(options.categories)
    }
  }

  const removeDeckCard = (): void => {
    setPrevDeckQuantity(deckQuantity)
    setDeckQuantity(0)
    setFoilDeckQuantity(0)
  }

  // Updates the card quantity on the db
  const saveDeckCard = async (): Promise<void> => {
    try {
      const params = {
        quantity: deckQuantity,
        foil: foilDeckQuantity,
        categories,
      }

      if (prevDeckQuantity === 0 && deckQuantity === 1) {
        await add(id, { ...options, deckId, params })
        addToast(
          `${name} added to ${(deckId && options && options.name) ||
            'Collection'}`
        )
      } else if (deckQuantity <= 0) {
        await remove(id, { ...options, deckId, params })
        addToast(
          `${name} was removed from ${deckId && options && options.name}`,
          {
            appearance: 'info',
          }
        )
      } else if (prevDeckQuantity !== deckQuantity) {
        await update(id, { ...options, deckId, params })
        addToast(
          `${name} quantity updated to ${deckQuantity} in ${options &&
            options.deckId &&
            options.name}`,
          {
            appearance: 'info',
          }
        )
      }
    } catch (error) {
      console.log('Unable to update card.')
    } finally {
      if (typeof options.updateDeck === 'function') {
        options.updateDeck()
      }
    }
  }

  // COLLECTION RELATED ACTIONS
  const addCollectionCard = (options?: any): void => {
    setPrevCollectionQuantity(collectionQuantity)
    setCollectionQuantity(1)

    // Adds foil quantity if present in options
    if (options && options.foil) {
      setFoilCollectionQuantity(1)
    }
  }

  const updateCollectionCard = (newQuantity: number, options?: any): void => {
    setPrevCollectionQuantity(collectionQuantity)
    setCollectionQuantity(newQuantity)

    // There can never be more foils than total quantity.
    // This ensures the user gets current information when updating counts
    if (foilCollectionQuantity > newQuantity) {
      setFoilCollectionQuantity(newQuantity)
    }

    if (options && options.foil !== undefined) {
      setFoilCollectionQuantity(options.foil)
    }
  }

  const removeCollectionCard = (): void => {
    setPrevCollectionQuantity(collectionQuantity)
    setCollectionQuantity(0)
    setFoilCollectionQuantity(0)
  }

  // Updates the card quantity on the db
  const saveCollectionCard = async (): Promise<void> => {
    try {
      const params = {
        quantity: collectionQuantity,
        foil: foilCollectionQuantity,
      }

      if (prevCollectionQuantity === 0 && collectionQuantity === 1) {
        await add(id, { ...options, params })
        addToast(`${name} added to Collection`)
      } else if (collectionQuantity <= 0) {
        await remove(id, { ...options, params })
        addToast(`${name} was removed from Collection`, {
          appearance: 'info',
        })
      } else if (prevCollectionQuantity !== collectionQuantity) {
        await update(id, { ...options, params })
        addToast(
          `${name} quantity updated to ${collectionQuantity} in Collection`,
          {
            appearance: 'info',
          }
        )
      }
    } catch (error) {
      console.log('Unable to update card.')
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

    setImages(images)
  }

  const handleCardImage = async () => {
    const cardData = await getCard(scryfallId)

    // Set card images
    getCardImage(cardData, 'normal')

    // Set card Price
    setPrices(cardData && cardData.prices)
  }

  // Grabs the card Image on load
  useEffect(() => {
    if (isLoading) {
      handleCardImage()
      setIsLoading(false)
    }
  }, [isLoading])

  // Uses debounce to update card toasts and deck quantities
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => saveDeckCard(), 500)

      return (): void => {
        clearTimeout(timer)
      }
    }
  }, [deckQuantity])

  // Uses debounce to update card toasts and collection quantities
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => saveCollectionCard(), 500)

      return (): void => {
        clearTimeout(timer)
      }
    }
  }, [collectionQuantity])

  return {
    isLoading,
    images,
    prices,
    deck: {
      quantity: deckQuantity,
      foilQuantity: foilDeckQuantity,
      categories,
      actions: {
        add: addDeckCard,
        update: updateDeckCard,
        remove: removeDeckCard,
      },
    },
    collection: {
      quantity: collectionQuantity,
      foilQuantity: foilCollectionQuantity,
      actions: {
        add: addCollectionCard,
        update: updateCollectionCard,
        remove: removeCollectionCard,
      },
    },
  }
}
