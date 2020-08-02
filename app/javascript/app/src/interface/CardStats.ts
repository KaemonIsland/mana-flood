interface Colors {
  W: number
  U: number
  B: number
  R: number
  G: number
  C: number
  M: number
}

interface Count {
  count: number
  subtypes: any
}

interface Types {
  creature: Count
  enchantment: Count
  instant: Count
  land: Count
  sorcery: Count
  planeswalker: Count
  artifact: Count
}

interface Cmc {
  1: number
  2: number
  3: number
  4: number
  5: number
  6: number
}

interface Counts {
  creature: number
  nonCreature: number
  land: number
  nonLand: number
}

interface Rarity {
  common: number
  uncommon: number
  rare: number
  mythic: number
}

export interface CardStats {
  colors: Colors
  types: Types
  cmc: Cmc
  counts: Counts
  rarity: Rarity
  cards: number
}
