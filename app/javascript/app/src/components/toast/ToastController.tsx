import React, { useState, useEffect } from 'react'
import { useTimer } from '../../utils/hooks'

export const ToastController = ({
  autoDismiss = false,
  autoDismissTimeout,
  onDismiss,
  Toast,
  ...props
}) => {
  const [isRunning, setIsRunning] = useState(autoDismiss)
  const { clear, pause, resume } = useTimer(onDismiss, autoDismissTimeout)

  const startTimer = () => {
    resume()
  }

  const clearTimer = () => {
    clear()
  }

  const handleMouseEnter = () => {
    setIsRunning(false)
    pause()
  }

  const handleMouseLeave = () => {
    setIsRunning(true)
    resume()
  }

  useEffect(() => {
    if (autoDismiss && isRunning) {
      startTimer()
    } else {
      clearTimer()
    }

    return () => {
      clearTimer()
    }
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
