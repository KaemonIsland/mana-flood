export interface Ruling {
  date: Date
  text: string
}

export interface Variation {
  id: number
  uuid: string
  imgUri?: string
  scryfallId?: string
}

export interface Card {
  isAlternative: boolean
  isPromo: boolean
  id: number
  name: string
  colorIdentity: string | Array<string>
  scryfallId: string
  manaCost: string
  power: number
  toughness: number
  cardType: string
  artist: string
  rulings: Array<Ruling> | Array<[]>
  legalities: object
  flavorText: string
  text: string
  rarity: string
  number: number
  collection: number
  deck?: number
  variations: Array<Variation>
}
