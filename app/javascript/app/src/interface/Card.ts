import { Deck } from './Deck'

interface Ruling {
  date: Date
  text: string
}

interface Collection {
  hasCard: boolean
  quantity: number
}

export interface Card {
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
