import React from 'react'
import { ThemeProvider, Text, Flex } from 'warlock-ui'
import styled from 'styled-components'
import { Set } from './Set'

const SetGrid = styled.section(({ theme }) => ({
  maxWidth: '101rem',
  margin: '0 auto',
  display: 'grid',
  gridGap: theme.formatSpace(4),
  gridTemplateColumns: `repeat(auto-fill, minmax(${theme.formatSpace(
    11
  )}, ${theme.formatSpace(12)}))`,
  justifyContent: 'center',
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
  console.log(filteredSets[0])
  return (
    <ThemeProvider>
      <Flex justifyContent="center" alignItems="center">
        <Text size={10}>All Expansions</Text>
      </Flex>
      <hr />
      <SetGrid>
        {filteredSets.map((set: CardSet) => (
          <Set {...set} />
        ))}
      </SetGrid>
    </ThemeProvider>
  )
}
