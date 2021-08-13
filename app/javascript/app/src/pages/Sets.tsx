import React, { ReactElement, useState } from 'react'
import { Text, Flex, Container } from 'warlock-ui'
import styled from 'styled-components'
import { toCamelcase } from '../utils'
import { CardSet } from '../interface'
import { Page, Sets as SetsGroup, Collapse, Feather } from '../components'

interface SetSectionProps {
  setType: string
  sets: Array<any>
}

const ClickableContent = styled.div(({ theme }) => ({
  cursor: 'pointer',
  padding: theme.spaceScale(3),
  borderRadius: theme.spaceScale(2),
  transition: 'all 200ms ease-in-out',
  '&:hover, &:focus': {
    backgroundColor: theme.color.coolGrey[3],
  },
}))

const SetSection = ({ setType, sets }: SetSectionProps): ReactElement => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Collapse isOpen={isOpen}>
      <Collapse.Header>
        <>
          <ClickableContent>
            <Flex alignItems="center" justifyContent="space-between">
              <Text
                family="Roboto"
                isBold
                size={8}
                onClick={() => {
                  setIsOpen(!isOpen)
                }}
                style={{ textTransform: 'uppercase' }}
              >
                {setType.replace(/_/g, ' ')}
              </Text>
              <Feather icon={`arrow-${isOpen ? 'up' : 'down'}`} />
            </Flex>
          </ClickableContent>
          <hr />
        </>
      </Collapse.Header>
      <Collapse.Content>
        <SetsGroup sets={sets} link="/sets" />
      </Collapse.Content>
    </Collapse>
  )
}

interface SetsProps {
  sets: Array<CardSet>
}

// eslint-disable-next-line
export const Sets = ({ sets }: SetsProps): ReactElement => {
  const formattedSets = toCamelcase(sets)

  // Sort all sets by their set type
  const sortedSets = formattedSets.reduce((acc, cur) => {
    const setType = cur.setType
    if (acc[setType]) {
      acc[setType].push(cur)
    } else {
      acc[setType] = [cur]
    }

    return acc
  }, {})

  // Sort set types alphabetically for convenient listing
  const setTypes: Array<string> = Object.keys(sortedSets).sort()

  return (
    <Page>
      <Flex justifyContent="start" alignItems="center">
        <Text size={10}>Sets</Text>
      </Flex>
      <hr />
      <div>
        {setTypes.map((setType, index) => (
          <Container marginTop="6" key={`${setType}${index}`}>
            <SetSection setType={setType} sets={sortedSets[setType]} />
          </Container>
        ))}
      </div>
    </Page>
  )
}
