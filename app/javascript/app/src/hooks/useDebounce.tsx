import { useEffect, useState } from 'react'

export const useDebounce = (value: any, delay?: number): any => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500)

    return (): void => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}
