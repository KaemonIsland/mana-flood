import { useEffect } from 'react'

/**
 * A Hook used to detect if a user clicks outside of a ref.
 * @param {node} refs - An array of refs or a single ref.
 * This is what the hook will use to test if the user clicked outside of an element.
 * @param {func} handler - The function to be called when the user
 * clicks outside of the ref
 */
export const useOnClickOutside = (refs, handler) => {
  // If refs is a single item, it will be added to an array
  const refsArr = Array.isArray(refs) ? refs : [refs]

  useEffect(() => {
    /**
     * This does nothing if the ref's element or children are clicked.
     * @param {obj} event - the click event object
     */
    const listener = event => {
      // Tests if the user clicked within a ref from refsArr
      if (
        refsArr.some(ref => !ref.current || ref.current.contains(event.target))
      ) {
        return
      }
      handler(event)
    }

    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)

    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [refsArr, handler])
}
