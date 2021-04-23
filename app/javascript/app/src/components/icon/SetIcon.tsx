import React, { ReactElement } from 'react'
import { setIcons } from '../../../../packs/application.js'

interface SetIconProps {
  setCode: string
  size: number
  rarity?: string
}
export const SetIcon = ({
  setCode = '',
  size = 1,
  rarity = 'common',
}: SetIconProps): ReactElement => {
  const formattedSetCode = String(setCode).toLowerCase()

  return <i className={`ss ss-${formattedSetCode} ss-${size}x ss-${rarity}`} />
}
