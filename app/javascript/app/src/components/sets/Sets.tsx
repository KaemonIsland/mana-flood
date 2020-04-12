import React from 'react'
import { ThemeProvider, Text, Flex, Button } from 'warlock-ui'
import styled from 'styled-components'
import Turbolinks from 'turbolinks'

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

const SetContainer = styled.div(({ theme }) => ({
  padding: theme.spaceScale(2),
  border: '1px solid black',
  width: theme.spaceScale(12),
  boxShadow: theme.boxShadow.single[1],
  background: `linear-gradient(${theme.color.coolGrey[1]}, ${theme.color.coolGrey[3]})`,
  borderRadius: theme.spaceScale(1),
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
        {filteredSets.map(({ id, base_set_size, name }: CardSet) => (
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
              <Text font>{base_set_size} cards</Text>
              {/* TODO Fix Container */}
              <div style={{ marginTop: '1rem', width: '100%' }}>
                <Flex alignItems="center" justifyContent="center">
                  <Button
                    color="coolGrey"
                    shade={8}
                    onClick={() => viewSetCards(id)}
                  >
                    Cards
                  </Button>
                </Flex>
              </div>
            </Flex>
          </SetContainer>
        ))}
      </SetGrid>
    </ThemeProvider>
  )
}
