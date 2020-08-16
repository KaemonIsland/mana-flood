import React, {
  useContext,
  createContext,
  useState,
  ReactElement,
  ReactChildren,
  ReactChild,
} from 'react'
import { createPortal } from 'react-dom'
import { Transition, TransitionGroup } from 'react-transition-group'
import { ToastController, ToastContainer, Toast } from '../components/toast'
import { ueid } from '../utils'

const ToastContext = createContext({
  add: (content?: string, options = {}): void => null,
  remove: (id: string | number): void => null,
  removeAll: (): void => null,
  update: (id: string | number, options = {}): void => null,
  toasts: [],
})

/**
 * Use context hook for interacting with toasts.
 *
 * Must be used within a child of ToastProvider.
 */
export const useToasts = () => {
  const { add, remove, removeAll, update, toasts } = useContext(ToastContext)

  return {
    addToast: add,
    removeToast: remove,
    removeAllToasts: removeAll,
    updateToast: update,
    toasts,
  }
}

/**
 * Boolean to let us know where to render toasts
 */
const canUseDOM = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
)

interface ToastProviderProps {
  autoDismiss?: boolean
  autoDismissTimeout?: number
  transitionDuration?: number
  children: ReactChildren | ReactChild
}

/**
 * Toast context provider.
 * Accepts settings for toasts that van be passed as a "value" prop.
 */
export const ToastProvider = ({
  autoDismiss = true,
  autoDismissTimeout = 5000,
  transitionDuration = 220,
  children,
}: ToastProviderProps): ReactElement => {
  const [toasts, setToasts] = useState([])

  const has = (id: number | string): boolean =>
    !!toasts.filter(toast => toast.id === id).length

  // Adds new toast to toast list
  const add = (content: string, options = {}): void => {
    const id = ueid()

    // bail if a toast exists with this ID
    if (has(id)) {
      return
    }

    const newToast = { content, id, ...options }

    // adds new toast to toasts
    setToasts(currentToasts => [...currentToasts, newToast])
  }

  // Removes toasts from toast list
  const remove = (id: number): void => {
    // bail if NO toasts exists with this ID
    if (!has(id)) {
      return
    }

    setToasts(currentToasts => currentToasts.filter(toast => toast.id !== id))
  }

  const removeAll = (): void => setToasts([])

  const update = (id: number | string, options = {}): void => {
    // bail if NO toasts exists with this ID
    if (!has(id)) {
      return
    }

    // update the toast stack
    setToasts(currentToasts => {
      const old = [...currentToasts]
      const index = old.findIndex(toast => toast.id === id)
      const updatedToast = { ...old[index], ...options }
      const updatedToasts = [
        ...old.slice(0, index),
        updatedToast,
        ...old.slice(index + 1),
      ]

      return updatedToasts
    })
  }

  const onDismiss = id => remove(id)

  const hasToasts = Boolean(toasts.length)
  const portalTarget = canUseDOM ? document.body : null // appease flow

  return (
    <ToastContext.Provider value={{ add, remove, removeAll, update, toasts }}>
      {children}
      {portalTarget &&
        createPortal(
          <ToastContainer hasToasts={hasToasts}>
            <TransitionGroup component={null}>
              {toasts.map(
                ({
                  appearance,
                  autoDismiss: propAutoDismiss,
                  content,
                  id,
                  ...unknownConsumerProps
                }) => (
                  <Transition
                    appear
                    key={id}
                    mountOnEnter
                    timeout={transitionDuration}
                    unmountOnExit
                  >
                    {transitionState => (
                      <ToastController
                        appearance={appearance || 'success'}
                        autoDismiss={
                          propAutoDismiss !== undefined
                            ? propAutoDismiss
                            : autoDismiss
                        }
                        autoDismissTimeout={autoDismissTimeout}
                        Toast={Toast}
                        key={id}
                        onDismiss={() => onDismiss(id)}
                        transitionDuration={transitionDuration}
                        transitionState={transitionState}
                        {...unknownConsumerProps}
                      >
                        {content}
                      </ToastController>
                    )}
                  </Transition>
                )
              )}
            </TransitionGroup>
          </ToastContainer>,
          portalTarget
        )}
    </ToastContext.Provider>
  )
}
