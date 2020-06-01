import { Deck } from './Deck'

export interface Ruling {
  date: Date
  text: string
}

export interface Collection {
  hasCard: boolean
  quantity: number
}

export interface Card {
  id: number
  name: string
  colorIdentity: string
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
  collection?: Collection
  decks?: Array<Deck> | Array<[]>
}
