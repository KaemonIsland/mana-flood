import React, { ReactElement } from 'react'
import styled from 'styled-components'
import { manaSvgs } from '../../../packs/application.js'

const Mana = styled.div`
  height: ${({ theme, height }): string => theme.spaceScale(height)};
  width: ${({ theme, width }): string => theme.spaceScale(width)};
  margin-right: ${({ theme }): string => theme.spaceScale(1)};
  border: 1px solid black;
  border-radius: 50%;
`

const Img = styled.img`
  width: 100%;
  height: auto;
  max-width: 100%;
`

interface ManaSymbolProps {
  mana: string
  size: string
}

export const ManaSymbol = ({ mana, size }: ManaSymbolProps): ReactElement => {
  const sizes = {
    small: { width: 5, height: 5 },
    medium: { width: 6, height: 6 },
    large: { width: 8, height: 8 },
  }

  return (
    <Mana {...sizes[size]}>
      <Img src={manaSvgs(`./${mana}.svg`)} alt="0" />
    </Mana>
  )
}
