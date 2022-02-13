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
        <Container paddingRight={3} {...labelContainerProps}>
          <Text align="right" family="roboto">
            {label}:
          </Text>
        </Container>
        <Container width="3.5rem" {...priceContainerProps}>
          <Text family="roboto">${price}</Text>
        </Container>
      </Flex>
    </Container>
  )
}
