import React from 'react'
import { Text, Flex } from 'warlock-ui'
import styled from 'styled-components'
import { formatDate } from '../../utils'
import { Page } from '../page'

const SetGrid = styled.section(({ theme }) => ({
  maxWidth: '101rem',
  margin: '0 auto',
  display: 'grid',
  gridGap: theme.spaceScale(4),
  gridTemplateColumns: `repeat(auto-fill, minmax(${theme.spaceScale(
    11
  )}, ${theme.spaceScale(12)}))`,
  justifyContent: 'center',
}))

const SetContainer = styled.a(({ theme }) => ({
  textDecoration: 'none',
  padding: theme.spaceScale(2),
  border: `1px solid ${theme.color.purple[8]}`,
  width: theme.spaceScale(12),
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

type CardSet = {
  name: string
  release_date: string
  id: number
  code: string
  base_set_size: number
}

export const Sets = ({ sets }) => {
  const filteredSets = sets.filter(({ set_type }) => set_type === 'expansion')

  return (
    <Page>
      <Flex justifyContent="start" alignItems="center">
        <Text size={10}>Sets</Text>
      </Flex>
      <hr />
      <SetGrid>
        {filteredSets.map(
          ({ id, base_set_size, name, release_date }: CardSet) => (
            <SetContainer key={id} href={`/sets/${id}`}>
              <Flex
                direction="column"
                justifyContent="space-around"
                alignItems="start"
              >
                <Text size={5}>{name}</Text>
                <br />
                <Text font="roboto" isItalics>
                  {formatDate(new Date(release_date), {})}
                </Text>
                <Text font="roboto">{base_set_size} cards</Text>
              </Flex>
            </SetContainer>
          )
        )}
      </SetGrid>
    </Page>
  )
}
