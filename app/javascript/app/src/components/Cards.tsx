import React from 'react'
import { Card } from './Card'

export const Cards = ({ cards }) => {
  return (
    <div>
      {cards.map(card => (
        <Card {...card} />
      ))}
    </div>
  )
}
