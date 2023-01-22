import React, { ReactElement } from 'react'
import { Container, Flex, Text } from 'warlock-ui'

export interface PriceProps {
  label: string
  price: number
  containerProps?: any
  labelContainerProps?: any
  priceContainerProps?: any
}

/**
 * Price component for listing prices next to labels.
 *
 * Prices will always be listed with a `$` in addition to being left aligned.
 * Labels will always be right aligned.
 */
export const Price = ({
  label,
  price,
  containerProps,
  labelContainerProps,
  priceContainerProps,
}: PriceProps): ReactElement => {
  return (
    <Container isFullWidth {...containerProps}>
      <Flex alignItems="center" justifyContent="space-between">
        <Container paddingRight={2} {...labelContainerProps}>
          <Text align="right" family="roboto" style={{ fontSize: '0.75rem' }}>
            {label}:
          </Text>
        </Container>
        <Container width="3rem" {...priceContainerProps}>
          <Text family="roboto" style={{ fontSize: '0.75rem' }}>
            ${price}
          </Text>
        </Container>
      </Flex>
    </Container>
  )
}
