import React from 'react'
import 'cross-fetch/polyfill'
import snakeCaseKeys from 'snakecase-keys'

const blockedCardAttributes = [
  'count',
  'duelDeck',
  'foreignData',
  'frameEffect',
  'frameEffects',
  'frameVersion',
  'hand',
  'hasNoDeckLimit',
  'isTimeshifted',
  'life',
  'mtgstocksId',
  'purchaseUrls',
  'isDateStamped',
  'isBuyABox',
]

const allowedCardAttributes = {
  artist: '',
  borderColor: '',
  colorIdentity: '',
  colorIndicator: '',
  colors: '',
  convertedManaCost: 0,
  edhrecRank: 0,
  faceConvertedManaCost: 0,
  flavorText: '',
  hasFoil: false,
  hasNonFoil: false,
  isAlternative: false,
  isArena: false,
  isFullArt: false,
  isMtgo: false,
  isOnlineOnly: false,
  isOversized: false,
  isPaper: false,
  isPromo: false,
  isReprint: false,
  isReserved: false,
  isStarter: false,
  isStorySpotlight: false,
  isTextless: false,
  layout: '',
  leadershipSkills: '',
  legalities: '',
  loyalty: '',
  manaCost: '',
  mcmId: 0,
  mcmMetaId: 0,
  mtgArenaId: 0,
  mtgoFoilId: 0,
  mtgoId: 0,
  multiverseId: 0,
  name: '',
  names: '',
  number: '',
  originalText: '',
  originalType: '',
  otherFaceIds: '',
  power: '',
  prices: '',
  printings: '',
  rarity: '',
  reverseRelated: '',
  rulings: '',
  scryfallId: '',
  scryfallOracleId: '',
  scryfallIllustrationId: '',
  side: '',
  subtypes: '',
  supertypes: '',
  tcgplayerProductId: 0,
  text: '',
  toughness: '',
  cardType: '',
  cardTypes: '',
  uuid: '',
  variations: '',
  watermark: '',
}

const blockedSetAttributes = ['boosterV3', 'meta', 'tokens', 'translations']

const allowedSetAttributes = {
  baseSetSize: 0,
  block: '',
  code: '',
  codeV3: '',
  isForeignOnly: false,
  isFoilOnly: false,
  isOnlineOnly: false,
  isPartialPreview: false,
  keyruneCode: '',
  mcmName: '',
  mcmId: 0,
  mtgoCode: '',
  name: '',
  parentCode: '',
  releaseDate: '',
  tcgplayerGroupId: 0,
  totalSetSize: 0,
  setType: '',
}

export const Cards = () => {
  const buildCardParams = cards => {
    let params = []
    cards.forEach(card => {
      let formattedCard = { ...allowedCardAttributes }
      for (let [key, value] of Object.entries(card)) {
        if (blockedCardAttributes.includes(key)) {
          continue
        } else if (key === 'type') {
          formattedCard['cardType'] = value
        } else if (key === 'types') {
          formattedCard['cardTypes'] = JSON.stringify(value)
        } else if (typeof value === 'object') {
          formattedCard[key] = JSON.stringify(value)
        } else {
          formattedCard[key] = value
        }
      }
      params.push(formattedCard)
    })
    return snakeCaseKeys(params)
  }

  const getAllCards = async () => {
    const response = await fetch('https://www.mtgjson.com/files/AllCards.json')

    const cards = Object.values(await response.json())

    const formattedParams = buildCardParams(cards)

    try {
      await fetch('/update_cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cards: formattedParams }),
      })
    } catch (error) {
      console.log('There was an error, ', error)
    }
  }

  const getCardUuids = cardArr => cardArr.map(card => card.uuid)

  const buildSetParams = sets => {
    let params = { card_uuids: [], card_sets: [] }
    Object.values(sets).forEach(set => {
      if (!set.mcmId) {
        return
      }
      if (set.codeV3 === 'DD3_EVG') {
        return
      }
      let formattedSet = { ...allowedSetAttributes }
      for (let [key, value] of Object.entries(set)) {
        if (blockedSetAttributes.includes(key)) {
          continue
        } else if (key === 'type') {
          formattedSet['setType'] = value
        } else if (key === 'cards') {
          params.card_uuids.push({
            mcmId: set.mcmId,
            uuids: getCardUuids(set[key]),
          })
        } else if (typeof value === 'object') {
          formattedSet[key] = JSON.stringify(value)
        } else {
          formattedSet[key] = value
        }
      }
      params.card_sets.push(formattedSet)
    })
    return snakeCaseKeys(params)
  }

  const getAllSets = async () => {
    try {
      const response = await fetch(
        'https://www.mtgjson.com/files/AllPrintings.json'
      )

      const formattedSetParams = buildSetParams(await response.json())

      console.log('Formatted Set Params: ', formattedSetParams)

      try {
        await fetch('/update_card_sets', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formattedSetParams),
        })
      } catch (error) {
        console.log('There was an error, ', error)
      }
    } catch (error) {
      console.log('There was an error, ', error)
    }
  }

  return (
    <>
      <button onClick={getAllCards}>Update card collection</button>
      <button onClick={getAllSets}>Update card sets</button>
    </>
  )
}
