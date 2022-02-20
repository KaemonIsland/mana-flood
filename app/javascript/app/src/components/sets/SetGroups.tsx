import React, { useState, ReactElement } from 'react'
import { Text, Flex, Container, Button } from 'warlock-ui'
import { toCamelcase } from '../../utils'
import { CardSet } from '../../interface'
import { Sets as SetsGroup } from '../'

interface SetSectionProps {
  setType: string
  sets: Array<any>
  setsOptions: any
}

const SetSection = ({
  setType,
  sets,
  setsOptions,
}: SetSectionProps): ReactElement => {
  const formattedSetType = setType.replace(/_/g, ' ')

  return (
    <>
      <Flex alignItems="center" justifyContent="space-between">
        <Text
          family="Roboto"
          isBold
          size={8}
          style={{ textTransform: 'uppercase' }}
        >
          {formattedSetType}
        </Text>
      </Flex>
      <br />
      <SetsGroup sets={sets} {...setsOptions} />
    </>
  )
}

interface SetsProps {
  sets: Array<CardSet>
  setsOptions: any
}

/**
 * Groups sets together by set type
 */
export const SetGroups = ({ sets, setsOptions }: SetsProps): ReactElement => {
  const formattedSets = toCamelcase(sets)
  const [currentSetType, setCurrentSetType] = useState(null)

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
    <>
      <Flex alignItems="center" justifyContent="space-between">
        {setTypes.map(setType => (
          <Container key={setType} padding="0.25rem">
            <Button
              onClick={(): void => {
                setCurrentSetType(setType)
              }}
            >
              {setType.replace(/_/g, ' ')}
            </Button>
          </Container>
        ))}
      </Flex>
      {currentSetType ? (
        <Container marginTop="6">
          <SetSection
            setType={currentSetType}
            sets={sortedSets[currentSetType]}
            setsOptions={...setsOptions}
          />
        </Container>
      ) : null}
    </>
  )
}
