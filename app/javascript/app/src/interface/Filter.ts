interface Cmc {
  min: number
  max: number
}

export interface Filter {
  color: Array<string>
  rarity: Array<string>
  type: string | null
  cmc: Cmc
}
