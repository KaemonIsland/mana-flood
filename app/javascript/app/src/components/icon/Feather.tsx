import React, { ReactElement, useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import feather from 'feather-icons'

const StyledSvg = styled.div(({ theme, size }) => ({
  height: theme.spaceScale(size),
  width: theme.spaceScale(size),
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
  ...props
}: FeatherProps): ReactElement => {
  const sizes = {
    small: 5,
    medium: 6,
    large: 7,
    xLarge: 8,
  }
  const theme = useContext(ThemeContext)

  /**
   * Obtains the svg string from feather-icons
   *
   * We must use dangerouslySetInnerHTML to render the svg properly
   * https://feathericons.com/
   */
  const featherIcon = feather.icons[icon].toSvg({
    height: '100%',
    width: '100%',
    color:
      color !== 'black' && color !== 'white'
        ? theme.color[color][shade]
        : color,
    ...props,
  })

  return (
    <StyledSvg
      size={sizes[size]}
      dangerouslySetInnerHTML={{ __html: featherIcon }}
    />
  )
}
