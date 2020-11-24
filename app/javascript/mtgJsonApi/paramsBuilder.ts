import snakeCaseKeys from 'snakecase-keys'

// The card attributes we don't care about
// https://mtgjson.com/structures/card/
const blockedCardAttributes: Array<string> = [
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
  'hasContentWarning',
]

// The Set attributes we don't care about
// https://mtgjson.com/structures/set/
const blockedSetAttributes: Array<string> = [
  'boosterV3',
  'meta',
  'tokens',
  'translations',
]

/**
 * in order to use upsert_all all models must have the same attributes.
 * https://edgeapi.rubyonrails.org/classes/ActiveRecord/Persistence/ClassMethods.html#method-i-upsert_all
 * We set the objects with their defaults here.
 */
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
  asciiName: '',
  flavorName: '',
}

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

export const buildCardParams = (cards: Array<object>): Array<object> => {
  let cardParams: Array<object> = []

  cards.forEach((card: Card) => {
    // Sets all default attributes
    let formattedCard: Card = { ...allowedCardAttributes }

    Object.entries(card).forEach(([key, value]) => {
      // Removes blocked attributes
      if (blockedCardAttributes.includes(key)) {
        // Type is a reserved word, use cardType
      } else if (key === 'type') {
        formattedCard['cardType'] = value

        // Use cardTypes for consistency
      } else if (key === 'types') {
        formattedCard['cardTypes'] = JSON.stringify(value)
      } else if (key === 'colorIdentity') {
        formattedCard[key] = value

        // Stringify the value if it's an object
      } else if (typeof value === 'object') {
        formattedCard[key] = JSON.stringify(value)

        // Otherwise we don't need to change anything
      } else {
        formattedCard[key] = value
      }
    })
    cardParams.push(formattedCard)
  })

  // Converts all camelCase keys to snake_case for Rails
  return snakeCaseKeys(cardParams)
}

// Grabs all uuids for cards within a set. The uuid is a unique key for each magic card
const getCardUuids = (cardArr: Array<object>): Array<string> =>
  cardArr.map((card: Card) => card.uuid)

// Builds the params object for adding Sets
export const buildSetParams = (sets: Array<object>): object => {
  /**
   * card_uuids an array of objects containing the mcm_id and an array of card uuids. We use this to add cards to a set
   * card_sets the actual card_set object
   */
  let setParams = { card_uuids: [], card_sets: [], cards: [] }

  Object.values(sets).forEach((set: Set) => {
    // We don't want any sets without an mcmId
    if (!set.mcmId) {
      return
    }
    // This is the only set with a repeated mcmId :shrug:
    if (set.codeV3 === 'DD3_EVG') {
      return
    }

    let formattedSet: Set = { ...allowedSetAttributes }

    Object.entries(set).forEach(([key, value]) => {
      if (blockedSetAttributes.includes(key)) {
        // Removes blocked attributes
        // Type is a reserved word, use setType
      } else if (key === 'type') {
        formattedSet['setType'] = value

        // Gets the uuids from the cards array
      } else if (key === 'cards') {
        setParams.card_uuids.push({
          mcmId: set.mcmId,
          uuids: getCardUuids(set[key]),
        })

        setParams.cards.push(...set[key])
      } else if (key === 'tokens') {
        setParams.cards.push(...set[key])

        // Stringify any objects
      } else if (typeof value === 'object') {
        formattedSet[key] = JSON.stringify(value)
      } else {
        formattedSet[key] = value
      }
    })
    setParams.card_sets.push(formattedSet)
  })

  setParams.cards = buildCardParams(setParams.cards)

  // Converts all camelCase keys to snake_case for Rails
  return snakeCaseKeys(setParams)
}
