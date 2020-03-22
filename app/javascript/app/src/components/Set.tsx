import React from 'react'
import styled from 'styled-components'
import Turbolinks from 'turbolinks'
import { Flex, Text, Button } from 'warlock-ui'

const SetContainer = styled.div(({ theme }) => ({
  padding: theme.formatSpace(2),
  border: '1px solid black',
  width: theme.formatSpace(12),
  boxShadow: theme.boxShadow.single[1],
  background: `linear-gradient(${theme.color.coolGrey[1]}, ${theme.color.coolGrey[3]})`,
  borderRadius: theme.formatSpace(1),
}))

export const Set = ({ id, base_set_size, name }) => {
  const viewSetCards = id => {
    Turbolinks.visit(`/sets/${id}`)
  }

  return (
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
            <Button callback={() => viewSetCards(id)} title="Cards" />
          </Flex>
        </div>
      </Flex>
    </SetContainer>
  )
}
