import { useEffect, useState } from 'react'

/**
 * Allows transitioning of mounted and unmounted components
 */
export const useMountTransition = (
  isMounted: boolean,
  unmountDelay: number
): boolean => {
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    let timeoutId

    if (isMounted && !isTransitioning) {
      setIsTransitioning(true)
    } else if (!isMounted && isTransitioning) {
      timeoutId = setTimeout(() => setIsTransitioning(false), unmountDelay)
    }
    return (): void => {
      clearTimeout(timeoutId)
    }
  }, [unmountDelay, isMounted, isTransitioning])

  return isTransitioning
}
