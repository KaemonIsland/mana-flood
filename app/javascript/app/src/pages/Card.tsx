import React, { ReactElement } from 'react'
import { Page, Full } from '../components'

interface Props {
  id: number
}

export const Card = ({ id }: Props): ReactElement => {
  return (
    <Page>
      <Full id={id} />
    </Page>
  )
}
