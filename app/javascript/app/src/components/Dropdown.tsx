import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  ReactElement,
  RefObject,
} from 'react'
import FocusLock from 'react-focus-lock'
import styled from 'styled-components'
import { useOnClickOutside } from '../utils'

const StyledMenu = styled('div')(
  ({ isOpen, triggerRect, dropdownRect, theme, isPaddingless, zIndex }) => {
    let left: number | string = '150%'
    let top = '150%'
    let marginTop

    if (triggerRect && dropdownRect && dropdownRect.width) {
      // Sets Top/Bottom positioning
      if (dropdownRect.height + triggerRect.bottom > window.innerHeight) {
        // Top
        top = -dropdownRect.height + triggerRect.top
        marginTop = -theme.spaceScale(1)
      } else {
        // Bottom
        top = triggerRect.bottom
        marginTop = theme.spaceScale(1)
      }

      // Sets Left/Right positioning
      if (dropdownRect.width + triggerRect.left > window.innerWidth) {
        left = triggerRect.left - (dropdownRect.width - triggerRect.width)
      } else {
        left = triggerRect.left
      }
    }

    return {
      display: isOpen ? 'block' : 'none',
      position: 'fixed',
      borderRadius: '4px',
      boxShadow: `0 2px 3px rgba(10,10,10,.1),
    0 0 0 1px rgba(10,10,10,.1)`,
      backgroundColor: theme.color.grey[2],
      padding: isPaddingless ? 0 : theme.spaceScale(2),
      maxWidth: '100%',
      marginTop,
      zIndex,
      left,
      top,
    }
  }
)

interface Close {
  (): void
}

interface DropdownProps {
  isPaddingless: boolean
  children: Array<ReactElement> | ReactElement
  zIndex: number
  isOpen: boolean
  role: string
  ariaLabelledby: string
  triggerRect: number
  triggerRef: RefObject<ReactElement>
  close: Close
  id: number
}

/**
 * This is the main Dropdown component
 * @param {boolean} isOpen If the dropdown is open or not
 * @returns {func} Dropdown component
 */
export const Dropdown = ({
  isPaddingless,
  children,
  zIndex = 20,
  isOpen,
  role,
  ariaLabelledby,
  triggerRect,
  triggerRef,
  close,
  id,
}: DropdownProps): ReactElement => {
  const dropdownRef = useRef(null)
  const [dropdownRect, setDropdownRect] = useState()

  useOnClickOutside([triggerRef, dropdownRef], close)
  const menuProps = {
    ref: dropdownRef,
    isOpen,
    triggerRect,
    dropdownRect,
    zIndex,
    isPaddingless,
    role,
    'aria-labelledby': ariaLabelledby,
    id,
  }

  /**
   * Closes the Dropdown component if the Escape key is pressed
   * @param {object} event - The keydown event object
   */
  const closeOnEscape = useCallback(
    event => {
      if (isOpen && event.key === 'Escape') {
        close()
      }
    },
    [close, isOpen]
  )

  useEffect(() => {
    if (isOpen) {
      // Sets dropdown width/height for positioning
      setDropdownRect(
        dropdownRef.current && dropdownRef.current.getBoundingClientRect()
      )
      // Adds event listener to close dropdown with Escape key
      document.addEventListener('keydown', closeOnEscape)
    }

    return () => {
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [isOpen, closeOnEscape])

  return (
    <FocusLock disabled={!isOpen} returnFocus>
      <StyledMenu {...menuProps}>{children}</StyledMenu>
    </FocusLock>
  )
}
