import React from 'react'
import styled from 'styled-components'
import { manaSvgs } from '../../../packs/application.js'

const Mana = styled.div`
  height: ${({ theme, height }) => theme.spaceScale(height)};
  width: ${({ theme, width }) => theme.spaceScale(width)};
  margin-right: ${({ theme }) => theme.spaceScale(1)};
  border: 1px solid black;
  border-radius: 50%;
`

const Img = styled.img`
  width: 100%;
  height: auto;
  max-width: 100%;
`

export const ManaSymbol = ({ mana, size }) => {
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
