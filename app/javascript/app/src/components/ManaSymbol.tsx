import React from 'react'
import styled from 'styled-components'
import { manaSvgs } from '../../../packs/application.js'

const Mana = styled.div`
  height: ${({ theme }) => theme.spaceScale(4)};
  width: ${({ theme }) => theme.spaceScale(4)};
  margin-right: ${({ theme }) => theme.spaceScale(1)};
  border: 1px solid black;
  border-radius: 50%;
`

const Img = styled.img`
  width: 100%;
  height: auto;
  max-width: 100%;
`

export const ManaSymbol = ({ mana }) => {
  return (
    <Mana>
      <Img width={5} height={5} src={manaSvgs(`./${mana}.svg`)} alt="0" />
    </Mana>
  )
}
