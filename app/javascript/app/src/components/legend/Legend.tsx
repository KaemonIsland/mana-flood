import React, { ReactElement } from 'react'
import { Feather } from '../icon'
import { Flex } from 'warlock-ui'

const frameEffects = [
  { name: 'Showcase', icon: 'star' },
  { name: 'Extended Art', icon: 'square' },
  { name: 'Inverted', icon: 'rotate-cw' },
]

/**
 * Returns a legend describing the different Icon meanings for card frame effects.
 */
export const Legend = (): ReactElement => (
  <Flex alignItems="center" justifyContent="space-between">
    {frameEffects.map(({ name, icon }, index) => (
      <Flex alignItems="center" key={`${name}-${index}`}>
        <p style={{ paddingRight: '0.5rem' }}>{name}</p>
        <Feather
          svgProps={{
            'stroke-width': 1,
          }}
          icon={icon}
          size="small"
        />
      </Flex>
    ))}
  </Flex>
)
