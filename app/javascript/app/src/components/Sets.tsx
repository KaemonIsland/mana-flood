import React from 'react'
import Turbolinks from 'turbolinks'
import { ThemeProvider, Container, Text, Button, Flex } from 'warlock-ui'
import styled from 'styled-components'
import { formatDate } from '../utils'

const SetContainer = styled.div(({ theme }) => ({
  padding: theme.formatSpace(2),
  border: '1px solid black',
  width: theme.formatSpace(12),
  boxShadow: theme.boxShadow.single[1],
  background: `linear-gradient(${theme.color.coolGrey[1]}, ${theme.color.coolGrey[3]})`,
  borderRadius: theme.formatSpace(1),
}))

const SetGrid = styled.section(({ theme }) => ({
  margin: '0 auto',
  display: 'grid',
  gridGap: theme.formatSpace(4),
  gridTemplateColumns: `repeat(auto-fit, minmax(${theme.formatSpace(
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

  const viewSetCards = id => {
    Turbolinks.visit(`/sets/${id}`)
  }
  return (
    <ThemeProvider>
      <Flex justifyContent="center" alignItems="center">
        <Text size={10}>All Expansions</Text>
      </Flex>
      <hr />
      <SetGrid>
        {filteredSets.map(
          ({ name, id, release_date, code, base_set_size }: CardSet) => (
            <SetContainer key={id}>
              <Flex
                direction="column"
                justifyContent="space-around"
                alignItems="center"
              >
                <Text
                  size={5}
                  style={{
                    textTransform: 'uppercase',
                    textAlign: 'center',
                  }}
                >
                  {name}
                </Text>
                <i className={`ss ss-${code.toLowerCase()} ss-3x`} />
                <Text isItalics style={{ display: 'inline-block' }}>
                  {formatDate(release_date, {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </Text>
                <Text font>{base_set_size} cards</Text>
                <Button callback={() => viewSetCards(id)} title="View Cards" />
              </Flex>
            </SetContainer>
          )
        )}
      </SetGrid>
    </ThemeProvider>
  )
}
