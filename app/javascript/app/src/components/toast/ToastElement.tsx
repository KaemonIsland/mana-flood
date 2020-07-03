import React, {
  useEffect,
  useRef,
  useState,
  ReactElement,
  ReactChild,
  ReactChildren,
} from 'react'
import styled, { keyframes } from 'styled-components'
import { Button } from 'warlock-ui'
import { CheckIcon, FlameIcon, InfoIcon, CloseIcon, AlertIcon } from './icons'
import * as colors from './colors'

// common
export const borderRadius = 4
export const gutter = 8
export const toastWidth = 360
export const shrinkKeyframes = keyframes`from { height: 100%; } to { height: 0% }`

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

// Animates the countdown progress
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

interface IconProps {
  appearance?: string
  autoDismiss?: boolean
  autoDismissTimeout?: number
  opacity?: number
  isRunning?: boolean
}

const Icon = ({
  appearance,
  autoDismiss,
  autoDismissTimeout,
  isRunning,
}: IconProps): ReactElement => {
  const meta = appearances[appearance]
  const Glyph = meta.icon

  return (
    <StyledIcon meta={meta}>
      <StyledCountdown
        autoDismissTimeout={autoDismissTimeout}
        opacity={autoDismiss ? 1 : 0}
        isRunning={isRunning}
      />
      <Glyph />
    </StyledIcon>
  )
}

// Transitions
// ------------------------------

const toastStates = () => ({
  entering: { transform: 'translate3d(120%, 0, 0)' },
  entered: { transform: 'translate3d(0,0,0)' },
  exiting: { transform: 'scale(0.66)', opacity: 0 },
  exited: { transform: 'scale(0.66)', opacity: 0 },
})

const ToastContainer = styled.div`
  transition: height ${({ transitionDuration }) => transitionDuration - 100}ms
    100ms;
`

const StyledToast = styled.div(
  ({ appearance, transitionDuration, transitionState }) => ({
    backgroundColor: appearances[appearance].bg,
    borderRadius,
    boxShadow: '0 3px 8px rgba(0, 0, 0, 0.175)',
    color: appearances[appearance].text,
    display: 'flex',
    marginBottom: gutter,
    transition: `transform ${transitionDuration}ms cubic-bezier(0.2, 0, 0, 1), opacity ${transitionDuration}ms`,
    width: toastWidth,
    ...toastStates()[transitionState],
  })
)

interface ToastElementProps {
  appearance?: string
  transitionDuration?: number
  transitionState?: string
  onMouseEnter?: any
  onMouseLeave?: any
  children?: ReactChild | ReactChildren
}

const ToastElement = ({
  appearance,
  transitionDuration,
  transitionState,
  ...props
}: ToastElementProps): ReactElement => {
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
        transitionState={transitionState}
      />
    </ToastContainer>
  )
}

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

const StyledContent = styled.div(() => ({
  flexGrow: 1,
  fontSize: 14,
  lineHeight: 1.4,
  minHeight: 40,
  padding: `${gutter}px ${gutter * 1.5}px`,
}))

// ==============================
// DefaultToast
// ==============================

interface ToastProps {
  appearance?: string
  autoDismiss?: boolean
  autoDismissTimeout?: number
  children?: ReactChild | ReactChildren
  isRunning?: boolean
  onDismiss?: any
  transitionDuration?: number
  transitionState?: string
  onMouseEnter?: any
  onMouseLeave?: any
}
export const Toast = ({
  appearance,
  autoDismiss,
  autoDismissTimeout,
  children,
  isRunning,
  onDismiss,
  transitionDuration,
  transitionState,
  onMouseEnter,
  onMouseLeave,
  ...otherProps
}: ToastProps): ReactElement => (
  <ToastElement
    appearance={appearance}
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
    <StyledContent>{children}</StyledContent>
    {onDismiss ? (
      <Button onClick={onDismiss}>
        <CloseIcon />
        <StyledTag>Close</StyledTag>
      </Button>
    ) : null}
  </ToastElement>
)
