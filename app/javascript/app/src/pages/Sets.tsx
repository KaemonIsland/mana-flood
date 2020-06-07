import React, { ReactElement } from 'react'
import { Text, Flex } from 'warlock-ui'
import { toCamelcase } from '../utils'
import { CardSet } from '../interface'
import { Page, Sets as SetsGroup } from '../components'

interface SetsProps {
  sets: Array<CardSet>
}

export const Sets = ({ sets }: SetsProps): ReactElement => {
  const filteredSets = toCamelcase(sets).filter(
    ({ setType }) => setType === 'expansion'
  )

  return (
    <Page>
      <Flex justifyContent="start" alignItems="center">
        <Text size={10}>Sets</Text>
      </Flex>
      <hr />
      <SetsGroup sets={filteredSets || []} link="/sets" />
    </Page>
  )
}
