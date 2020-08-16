import React, { ReactElement } from 'react'
import { Text } from 'warlock-ui'
import { Cards } from '../cards'
import { Page } from '../page'

interface SetProps {
  id: number
  name: string
}

export const Set = ({ id, name }: SetProps): ReactElement => (
  <Page>
    <Text
      size={10}
      style={{
        textTransform: 'uppercase',
      }}
    >
      {name}
    </Text>
    <hr />
    <Cards type="set" options={{ setId: id }} />
  </Page>
)
