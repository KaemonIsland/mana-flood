import React, { ReactElement, useState, useEffect } from 'react'
import axios from 'axios'
import { toCamelcase } from '../../utils'
import { Cards } from '../cards'
import { Stats } from './Stats'
import { Page } from '../page'
import { Deck as DeckType } from '../../interface'

export const Deck = ({ id }: DeckType): ReactElement => {
  const defaultDeck: DeckType = {
    id,
  }

  const [deck, setDeck] = useState(defaultDeck)
  const [isLoading, setIsLoading] = useState(true)

  const getDeck = async (): Promise<void> => {
    try {
      const response = await axios(`/api/v1/deck/${id}`)

      if (response.data) {
        setDeck(toCamelcase(response.data))
      }
    } catch (error) {
      console.log('Unable to get user decks: ', error)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    if (isLoading) {
      getDeck()
    }
  }, [isLoading])

  return (
    <Page defaultScope={deck}>
      {isLoading ? (
        <p>...Loading</p>
      ) : (
        <>
          <Stats stats={deck.stats} />
          <Cards type="deck" showScope={false} />
        </>
      )}
    </Page>
  )
}
