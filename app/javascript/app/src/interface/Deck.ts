import { CardStats } from './CardStats'

export interface Deck {
  id: number
  user_id?: number
  name?: string
  format?: string
  description?: string
  created_at?: string
  updated_at?: string
  colors?: Array<string>
  stats?: CardStats
}
