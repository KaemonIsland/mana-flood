import React, { useState, useEffect, ReactElement } from 'react'
import { useTimer } from '../../utils/hooks'

interface ToastControllerProps {
  autoDismiss?: boolean
  autoDismissTimeout?: number
  onDismiss: () => {}
  Toast: ReactElement
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
