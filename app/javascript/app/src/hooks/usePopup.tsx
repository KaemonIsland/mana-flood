import { useState, useRef } from 'react'
import { v4 as uuid } from 'uuid'

/**
 * Manages components that use a popup. This hook adds props for isOpen state,
 * Modal IDs and aria attributes.
 *
 * @returns {array} triggerProps - Place this within the element that triggers
 * the popup element.
 * dropdownProps - Place this within the popup element.
 * isOpen - The current state of the dropdown
 * open - function that opens the dropdown
 * close - function that closed the dropdown
 * This hook is required for the Dropdown Component
 */
export const usePopup = () => {
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef(null)

  // Generates a unique ID for the aria-controls / aria-labelledby attributes.
  const popupId = useRef(uuid())

  /**
   * Sets isOpen to true
   */
  const open = () => {
    setIsOpen(true)
  }

  /**
   * Sets isOpen to false
   */
  const close = () => {
    setIsOpen(false)
  }

  // Manage isOpen, ID, and aria-props
  const triggerProps = {
    'aria-controls': popupId.current,
    role: 'button',
    'aria-haspopup': 'true',
    'aria-expanded': isOpen,
    ref: triggerRef,
    onClick: () => setIsOpen(!isOpen),
  }
  const popupProps = {
    isOpen,
    role: 'menu',
    id: popupId.current,
    ariaLabelledby: triggerRef,
    triggerRef,
    close,
  }

  return {
    triggerProps,
    popupProps,
    isOpen,
    open,
    close,
  }
}
