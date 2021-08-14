import React, { ReactElement } from 'react'

interface SetIconProps {
  setCode: string
  size: number
  rarity?: string
}
export const SetIcon = ({
  setCode = '',
  size = 1,
  rarity = 'common',
  ...props
}: SetIconProps): ReactElement => {
  const formattedSetCode = String(setCode).toLowerCase()

  return (
    <i
      className={`ss ss-${formattedSetCode} ss-${size}x ss-${rarity}`}
      {...props}
    />
  )
}
