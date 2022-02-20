import React, { useState, useEffect, ReactElement, ElementType } from 'react'
import { useTimer } from '../../hooks'

interface ToastProps {
  appearance?: string
  autoDismiss?: boolean
  autoDismissTimeout?: number
  children?: Array<ReactElement>
  isRunning?: boolean
  onDismiss?: any
  transitionDuration?: number
  transitionState?: string
  onMouseEnter?: any
  onMouseLeave?: any
}

interface ToastControllerProps {
  autoDismiss?: boolean
  autoDismissTimeout?: number
  onDismiss: () => {}
  Toast: ElementType
}

export const ToastController = ({
  autoDismiss = false,
  autoDismissTimeout,
  onDismiss,
  Toast,
  ...props
}: ToastControllerProps): ReactElement => {
  const [isRunning, setIsRunning] = useState(autoDismiss)
  const { clear, pause, resume } = useTimer(onDismiss, autoDismissTimeout)

  const startTimer = (): void => resume()

  const clearTimer = (): void => clear()

  const handleMouseEnter = (): void => {
    setIsRunning(false)
    pause()
  }

  const handleMouseLeave = (): void => {
    setIsRunning(true)
    resume()
  }

  useEffect(() => {
    if (autoDismiss && isRunning) {
      startTimer()
    } else {
      clearTimer()
    }

    return (): void => clearTimer()
  }, [autoDismiss])

  return (
    <Toast
      autoDismiss={autoDismiss}
      autoDismissTimeout={autoDismissTimeout}
      isRunning={isRunning}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onDismiss={onDismiss}
      {...props}
    />
  )
}
