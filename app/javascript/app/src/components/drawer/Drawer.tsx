import React, { useRef, useEffect, ReactElement } from 'react'
import styled from 'styled-components'

interface DrawerProps {
  isOpen: boolean
  children: ReactElement | Array<ReactElement>
  onClose: () => void
  position?: string
  props?: any
}

const DrawerContainer = styled.div`
  transition-speed: 0.3s;
  &.open .left {
    transform: translateX(0);
  }
  &.open .drawer {
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
  }
  &.open .backdrop {
    visibility: visible;
    opacity: 1;
    pointer-events: auto;
    z-index: 999;
  }
`
const DrawerContent = styled.div`
  background: #fff;
  width: 40%;
  height: 100%;
  overflow: auto;
  position: fixed;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
  transition: transform 0.3s ease;
  z-index: 1000;
  &.left {
    top: 0;
    left: 0;
    transform: translateX(-100%);
  }
`
const Backdrop = styled.div`
  visibility: hidden;
  opacity: 0;
  background: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s ease, visibility 0.3s ease;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: fixed;
  pointer-events: none;
  z-index: 0;
`

/**
 * Used to display anything from menus to forms. Very similar to modals but attached to the side of the screen
 */
export const Drawer = ({
  isOpen,
  children,
  onClose,
  position = 'left',
  ...props
}: DrawerProps): ReactElement => {
  const bodyRef = useRef(document.querySelector('body'))

  useEffect(() => {
    const updatePageScroll = () => {
      if (isOpen) {
        bodyRef.current.style.overflow = 'hidden'
      } else {
        bodyRef.current.style.overflow = ''
      }
    }

    updatePageScroll()
  }, [isOpen])
  return (
    <DrawerContainer
      aria-hidden={isOpen ? 'false' : 'true'}
      className={`drawer-container${isOpen ? ' open' : ''}`}
    >
      <DrawerContent role="dialog" className={`drawer ${position}`}>
        {children}
      </DrawerContent>
      <Backdrop onClick={() => onClose} className="backdrop" />
    </DrawerContainer>
  )
}
