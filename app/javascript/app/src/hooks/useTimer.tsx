import { useState } from 'react'

export const useTimer = (callback: () => void, delay = 5000) => {
  const [timerId, setTimerId] = useState(0)
  const [startTime, setStartTime] = useState(delay)
  const [remainingTime, setRemainingTime] = useState(delay)

  const clear = () => clearTimeout(timerId)

  const pause = () => {
    clearTimeout(timerId)
    setRemainingTime(remaining => (remaining -= Date.now() - startTime))
  }

  const resume = () => {
    setStartTime(Date.now())
    clearTimeout(timerId)

    const newTimerId = Number(setTimeout(callback, remainingTime))
    setTimerId(newTimerId)
  }

  return {
    clear,
    pause,
    resume,
  }
}
