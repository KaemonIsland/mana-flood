import React, { useRef, useEffect, ReactElement } from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'
import FocusLock from 'react-focus-lock'
import { useMountTransition } from '../../hooks'

const createPortalRoot = (): any => {
  const drawerRoot = document.createElement('div')
  drawerRoot.setAttribute('id', 'drawer-root')
  return drawerRoot
}

const DrawerContainer = styled.div`
  transition-speed: 0.3s;
  &.in.open .left,
  &.in.open .right {
    transform: translateX(0);
  }
  &.in.open .top,
  &.in.open .bottom {
    transform: translateY(0);
  }
  &.open .drawer {
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
  }
  &.in.open .backdrop {
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
  &.top {
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    transform: translateY(-100%);
    height: 40%;
  }
  &.right {
    top: 0;
    right: 0;
    transform: translateX(100%);
  }
  &.bottom {
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    transform: translateY(100%);
    height: 40%;
  }
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

interface DrawerProps {
  isOpen: boolean
  children: ReactElement | Array<ReactElement>
  onClose: () => void
  position?: string
  removeWhenClosed?: boolean
  props?: any
}

/**
 * Used to display anything from menus to forms. Very similar to modals but attached to the side of the screen.
 *
 * This component was made by following a guide.
 *
 * @see https://letsbuildui.dev/articles/building-a-drawer-component-with-react-portals
 */
export const Drawer = ({
  isOpen,
  children,
  onClose,
  position = 'left',
  removeWhenClosed = false,
  ...props
}: DrawerProps): ReactElement => {
  // Body ref to set the current overflow
  const bodyRef = useRef(document.querySelector('body'))
  const isTransitioning = useMountTransition(isOpen, 300)

  // Prevents the background from scrolling when isOpen is set to true.
  useEffect(() => {
    const updatePageScroll = (): void => {
      if (isOpen) {
        bodyRef.current.style.overflow = 'hidden'
      } else {
        bodyRef.current.style.overflow = ''
      }
    }

    updatePageScroll()
  }, [isOpen])

  // Creates a ref to the portal root id
  const portalRootRef = useRef(
    document.getElementById('drawer-root') || createPortalRoot()
  )

  // Attaches the portal to the body
  useEffect(() => {
    bodyRef.current.appendChild(portalRootRef.current)
    const portal = portalRootRef.current
    const bodyEl = bodyRef.current

    return (): void => {
      // Clean up the portal when drawer component unmounts
      portal.remove()
      // Ensure scroll overflow is removed
      bodyEl.style.overflow = ''
    }
  }, [])

  // Adds keyboard event listeners when the drawer is open/closed
  useEffect(() => {
    const onKeyPress = e => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      window.addEventListener('keyup', onKeyPress)
    }

    return () => {
      window.removeEventListener('keyup', onKeyPress)
    }
  }, [isOpen, onClose])

  if (!isTransitioning && removeWhenClosed && !isOpen) {
    return null
  }

  return createPortal(
    <FocusLock disabled={!isOpen}>
      <DrawerContainer
        aria-hidden={isOpen ? 'false' : 'true'}
        className={`drawer-container${isOpen ? ' open' : ''}${
          isTransitioning ? ' in' : ''
        }`}
      >
        <DrawerContent
          role="dialog"
          className={`drawer ${position}`}
          {...props}
        >
          {children}
        </DrawerContent>
        <Backdrop
          onClick={(): void => {
            onClose()
          }}
          className="backdrop"
        />
      </DrawerContainer>
    </FocusLock>,
    portalRootRef.current
  )
}
