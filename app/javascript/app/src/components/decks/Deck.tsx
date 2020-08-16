import React, { ReactElement } from 'react'
import { Cards } from '../cards'
import { Stats } from './Stats'
import { Page } from '../page'
import { Deck as DeckType } from '../../interface'
// <Stats name={name} format={format} cards={cards} />

export const Deck = ({ id, ...rest }: DeckType): ReactElement => (
  <Page defaultScope={{ id, ...rest }}>
    <Cards type="deck" />
  </Page>
)
