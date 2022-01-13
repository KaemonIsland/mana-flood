import React, { ReactElement } from 'react'
import { Price } from './Price'

export interface PricesProps {
  prices: Array<{ label: string; price: number }>
  containerProps?: any
}

/**
 * Lists multiple prices at once
 */
export const Prices = ({ prices }: PricesProps): ReactElement => {
  const filteredPrices = prices.filter(({ label, price }) => label && price)

  return (
    <>
      {filteredPrices.map(({ label, price }, index) => (
        <Price key={index + price} label={label} price={price} />
      ))}
    </>
  )
}
