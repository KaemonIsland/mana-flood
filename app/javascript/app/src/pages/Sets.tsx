import React, { ReactElement } from 'react'
import { Flex, Text } from 'warlock-ui'
import { CardSet } from '../interface'
import { SetGroups, Page } from '../components'

interface SetsProps {
  sets: Array<CardSet>
}

/**
 * Groups sets together by set type
 */
export const Sets = ({ sets }: SetsProps): ReactElement => (
  <Page>
    <Flex justifyContent="start" alignItems="center">
      <Text size={10}>Sets</Text>
    </Flex>
    <hr />
    <SetGroups sets={sets} setsOptions={{ link: '/sets' }} />
  </Page>
)
