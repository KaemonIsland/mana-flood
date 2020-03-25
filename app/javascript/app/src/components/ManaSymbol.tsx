import React from 'react'
import { Image } from 'warlock-ui'
import { manaSvgs } from '../../../packs/application.js'

export const ManaSymbol = ({ mana }) => {
  return (
    <Image width={5} height={5} image={manaSvgs(`./${mana}.svg`)} alt="0" />
  )
}
