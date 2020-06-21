import React, { ReactElement } from 'react'
import styled from 'styled-components'
import feather from 'feather-icons'

const IconContainer = styled.div`
  height: ${({ theme, height }): string => theme.spaceScale(height)};
  width: ${({ theme, width }): string => theme.spaceScale(width)};
`

const StyledSvg = styled.div(({ theme, color, shade }) => ({
  width: '100%',
  height: 'auto',
  maxWidth: '100%',
  '& svg': {
    stroke:
      color !== 'black' && color !== 'white'
        ? theme.color[color][shade]
        : color,
  },
}))

interface FeatherProps {
  icon: string
  color?: string
  shade?: number
  size?: string
}

/**
 * Returns an Icon component
 *
 * specify the icon name, size, color, and shade for styling
 */
export const Feather = ({
  icon,
  size = 'medium',
  color = 'black',
  shade = 1,
}: FeatherProps): ReactElement => {
  const sizes = {
    small: { width: 5, height: 5 },
    medium: { width: 6, height: 6 },
    large: { width: 7, height: 7 },
    xLarge: { width: 8, height: 8 },
  }

  /**
   * Obtains the svg string from feather-icons
   *
   * We must use dangerouslySetInnerHTML to render the svg properly
   * https://feathericons.com/
   */
  const featherIcon = feather.icons[icon].toSvg()

  return (
    <IconContainer {...sizes[size]}>
      <StyledSvg
        color={color}
        shade={shade}
        dangerouslySetInnerHTML={{ __html: featherIcon }}
      />
    </IconContainer>
  )
}
