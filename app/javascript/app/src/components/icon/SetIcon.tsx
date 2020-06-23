import React, { ReactElement } from 'react'
import styled from 'styled-components'
import { setIcons } from '../../../../packs/application.js'

const IconContainer = styled.div`
  height: ${({ theme, height }): string => theme.spaceScale(height)};
  width: ${({ theme, width }): string => theme.spaceScale(width)};
`

const Img = styled.img`
  width: 100%;
  height: 100%;
  max-width: 100%;
`

interface SetIconProps {
  setCode: string
  size: string
}
export const SetIcon = ({ setCode = '', size }: SetIconProps): ReactElement => {
  const formattedSetCode = String(setCode).toLowerCase()

  const iconPath = setIcons(`./${formattedSetCode}.svg`)
  const sizes = {
    small: { width: 5, height: 5 },
    medium: { width: 6, height: 6 },
    large: { width: 7, height: 7 },
    xLarge: { width: 8, height: 8 },
  }

  return (
    <IconContainer {...sizes[size]}>
      {iconPath && <Img src={iconPath} alt={`${setCode} Icon`} />}
    </IconContainer>
  )
}
