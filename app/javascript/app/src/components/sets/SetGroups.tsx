import React, { ReactElement } from 'react'
import { Text, Flex, Container } from 'warlock-ui'
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
      {setTypes.map((setType, index) => (
        <Container marginTop="6" key={`${setType}${index}`}>
          <SetSection
            setType={setType}
            sets={sortedSets[setType]}
            setsOptions={...setsOptions}
          />
        </Container>
      ))}
    </>
  )
}
