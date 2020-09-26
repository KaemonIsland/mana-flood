import React, { useState, useEffect, ReactElement } from 'react'
import { Text } from 'warlock-ui'
import styled from 'styled-components'
import { cardActions } from '../utils'
import { Page, Sets } from '../components'

const SetContainer = styled.a(({ theme }) => ({
  display: 'block',
  marginBottom: theme.spaceScale(3),
  textDecoration: 'none',
  color: 'black',
  textTransform: 'uppercase',
  padding: theme.spaceScale(2),
  border: `1px solid ${theme.color.purple[8]}`,
  textAlign: 'center',
  boxShadow: theme.boxShadow.single[1],
  backgroundColor: 'white',
  borderRadius: theme.spaceScale(2),
  transition: 'all 200ms ease-in-out',
  '&:hover, &:focus': {
    backgroundColor: theme.color.purple[2],
    transform: 'translateY(-4px)',
    boxShadow: theme.boxShadow.single[2],
  },
  '&:active': {
    backgroundColor: theme.color.purple[2],
    transform: 'translateY(-2px)',
    boxShadow: theme.boxShadow.single[1],
  },
}))

export const Collection = (): ReactElement => {
  const [cardSets, setCardSets] = useState([])

  const getCollectionSets = async (): Promise<void> => {
    const sets = await cardActions.collection.sets()

    setCardSets(sets)
  }

  useEffect(() => {
    getCollectionSets()
  }, [])

  return (
    <Page>
      <Text size={10}>Collection</Text>
      <a href="/api/v1/export_collection" download="collection.json">
        Export Collection
      </a>
      <hr />
      <SetContainer href="/collection/all">
        <Text size={4} weight={500}>
          All Cards
        </Text>
      </SetContainer>
      <Sets sets={cardSets} link="/collection/set" />
    </Page>
  )
}
