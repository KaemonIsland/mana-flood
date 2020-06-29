import React, { useEffect, useRef, useState, ReactElement } from 'react'
import styled, { keyframes } from 'styled-components'

import { CheckIcon, FlameIcon, InfoIcon, CloseIcon, AlertIcon } from './icons'
import * as colors from './colors'

// common
export const borderRadius = 4
export const gutter = 8
export const toastWidth = 360
export const shrinkKeyframes = keyframes`from { height: 100%; } to { height: 0% }`

const StyledTag = styled.span(() => ({
  border: 0,
  clip: 'rect(1px, 1px, 1px, 1px)',
  height: 1,
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: 1,
}))

// a11y helper
const A11yText = ({ ...props }): ReactElement => <StyledTag {...props} />

// default appearances

const appearances = {
  success: {
    icon: CheckIcon,
    text: colors.G500,
    fg: colors.G300,
    bg: colors.G50,
  },
  error: {
    icon: FlameIcon,
    text: colors.R500,
    fg: colors.R300,
    bg: colors.R50,
  },
  warning: {
    icon: AlertIcon,
    text: colors.Y500,
    fg: colors.Y300,
    bg: colors.Y50,
  },
  info: {
    icon: InfoIcon,
    text: colors.N400,
    fg: colors.B200,
    bg: 'white',
  },
}

const StyledButton = styled.button(() => ({
  cursor: 'pointer',
  flexShrink: 0,
  opacity: 0.5,
  padding: `${gutter}px ${gutter * 1.5}px`,
  transition: 'opacity 150ms',

  '&:hover': { opacity: 1 },
}))

const Button = props => <StyledButton type="button" {...props} />

const StyledContent = styled.div(() => ({
  flexGrow: 1,
  fontSize: 14,
  lineHeight: 1.4,
  minHeight: 40,
  padding: `${gutter}px ${gutter * 1.5}px`,
}))

const Content = props => <StyledContent {...props} />

const StyledCountdown = styled.div`
  animation: ${shrinkKeyframes}
    ${({ autoDismissTimeout }) => autoDismissTimeout}ms linear;
  animation-play-state: ${({ isRunning }) =>
    isRunning ? 'running' : 'paused'};
  background-color: rgba(0, 0, 0, 0.1);
  bottom: 0;
  height: 0;
  left: 0;
  opacity: ${({ opacity }) => opacity};
  position: absolute;
  width: 100%;
`

// NOTE: invoke animation when NOT `autoDismiss` with opacity of 0 to avoid a
// paint bug in FireFox.
// https://bugzilla.mozilla.org/show_bug.cgi?id=625289
const Countdown = ({ autoDismissTimeout, opacity, isRunning, ...props }) => (
  <StyledCountdown
    opacity={opacity}
    isRunning={isRunning}
    autoDismissTimeout={autoDismissTimeout}
    {...props}
  />
)

const StyledIcon = styled.div(({ meta }) => ({
  backgroundColor: meta.fg,
  borderTopLeftRadius: borderRadius,
  borderBottomLeftRadius: borderRadius,
  flexShrink: 0,
  paddingBottom: gutter,
  paddingTop: gutter,
  position: 'relative',
  overflow: 'hidden',
  textAlign: 'center',
  color: meta.bg,
  width: 30,
}))

const Icon = ({ appearance, autoDismiss, autoDismissTimeout, isRunning }) => {
  const meta = appearances[appearance]
  const Glyph = meta.icon

  return (
    <StyledIcon meta={meta}>
      <Countdown
        opacity={autoDismiss ? 1 : 0}
        autoDismissTimeout={autoDismissTimeout}
        isRunning={isRunning}
      />
      <Glyph />
    </StyledIcon>
  )
}

// Transitions
// ------------------------------

const getTranslate = placement => {
  const pos = placement.split('-')
  const relevantPlacement = pos[1] === 'center' ? pos[0] : pos[1]
  const translateMap = {
    right: 'translate3d(120%, 0, 0)',
    left: 'translate3d(-120%, 0, 0)',
    bottom: 'translate3d(0, 120%, 0)',
    top: 'translate3d(0, -120%, 0)',
  }

  return translateMap[relevantPlacement]
}

const toastStates = placement => ({
  entering: { transform: getTranslate(placement) },
  entered: { transform: 'translate3d(0,0,0)' },
  exiting: { transform: 'scale(0.66)', opacity: 0 },
  exited: { transform: 'scale(0.66)', opacity: 0 },
})

const ToastContainer = styled.div`
  transition: height ${({ transitionDuration }) => transitionDuration - 100}ms
    100ms;
`

const StyledToast = styled.div(
  ({ appearance, transitionDuration, placement, transitionState }) => ({
    backgroundColor: appearances[appearance].bg,
    borderRadius,
    boxShadow: '0 3px 8px rgba(0, 0, 0, 0.175)',
    color: appearances[appearance].text,
    display: 'flex',
    marginBottom: gutter,
    transition: `transform ${transitionDuration}ms cubic-bezier(0.2, 0, 0, 1), opacity ${transitionDuration}ms`,
    width: toastWidth,
    ...toastStates(placement)[transitionState],
  })
)

const ToastElement = ({
  appearance,
  placement,
  transitionDuration,
  transitionState,
  ...props
}) => {
  const [height, setHeight] = useState('auto')
  const elementRef = useRef(null)

  useEffect(() => {
    if (transitionState === 'entered') {
      const el = elementRef.current
      setHeight(el.offsetHeight + gutter)
    }
    if (transitionState === 'exiting') {
      setHeight(0)
    }
  }, [transitionState])

  return (
    <ToastContainer
      ref={elementRef}
      style={{ height }}
      transitionDuration={transitionDuration}
    >
      <StyledToast
        {...props}
        appearance={appearance}
        transitionDuration={transitionDuration}
        placement={placement}
        transitionState={transitionState}
      />
    </ToastContainer>
  )
}

// ==============================
// DefaultToast
// ==============================

export const Toast = ({
  appearance,
  autoDismiss,
  autoDismissTimeout,
  children,
  isRunning,
  onDismiss,
  placement,
  transitionDuration,
  transitionState,
  onMouseEnter,
  onMouseLeave,
  ...otherProps
}) => (
  <ToastElement
    appearance={appearance}
    placement={placement}
    transitionState={transitionState}
    transitionDuration={transitionDuration}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    {...otherProps}
  >
    <Icon
      appearance={appearance}
      autoDismiss={autoDismiss}
      autoDismissTimeout={autoDismissTimeout}
      isRunning={isRunning}
    />
    <Content>{children}</Content>
    {onDismiss ? (
      <Button onClick={onDismiss}>
        <CloseIcon />
        <A11yText>Close</A11yText>
      </Button>
    ) : null}
  </ToastElement>
)
