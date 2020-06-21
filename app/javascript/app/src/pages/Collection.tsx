import React, { useState, useEffect, ReactElement } from 'react'
import { Text } from 'warlock-ui'
import { cardActions } from '../utils'
import { Page, Sets } from '../components'

export const Collection = (): ReactElement => {
  const [cardSets, setCardSets] = useState([])

  const getCollectionSets = async (): Promise<void> => {
    const newSets = await cardActions.collection.get()
    setCardSets(newSets)
  }

  useEffect(() => {
    getCollectionSets()
  }, [])

  return (
    <Page>
      <Text size={10}>Collection</Text>
      <hr />
      <Sets sets={cardSets} link="/collection/set" />
    </Page>
  )
}
