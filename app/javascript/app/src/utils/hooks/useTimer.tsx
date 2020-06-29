import { useState } from 'react'

export const useTimer = (callback: () => void, delay = 5000) => {
  const [timerId, setTimerId] = useState()
  const [startTime, setStartTime] = useState(delay)
  const [remainingTime, setRemainingTime] = useState(delay)

  const clear = () => clearTimeout(timerId)

  const pause = () => {
    clearTimeout(timerId)
    setRemainingTime((remainingTime -= Date.now() - startTime))
  }

  const resume = () => {
    setStartTime(Date.now())
    clearTimeout(timerId)
    setTimerId(setTimeout(callback, remainingTime))
  }

  return {
    clear,
    pause,
    resume,
  }
}
