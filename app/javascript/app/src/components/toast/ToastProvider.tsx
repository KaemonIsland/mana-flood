import React, { useContext, createContext, useState } from 'react'
import { createPortal } from 'react-dom'
import { Transition, TransitionGroup } from 'react-transition-group'

import { ToastController } from './ToastController'
import { ToastContainer } from './ToastContainer'
import { Toast } from './ToastElement'
import { ueid } from '../../utils'

const ToastContext = createContext({})

export const useToasts = () => {
  const ctx = useContext(ToastContext)

  if (!ctx) {
    throw Error(
      'The `useToasts` hook must be called from a descendent of the `ToastProvider`.'
    )
  }

  return {
    addToast: ctx.add,
    removeToast: ctx.remove,
    removeAllToasts: ctx.removeAll,
    updateToast: ctx.update,
    toasts: ctx.toasts,
  }
}

const canUseDOM = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
)

// Provider
// ==============================
export const ToastProvider = ({
  autoDismiss = true,
  autoDismissTimeout = 5000,
  placement = 'top-right',
  transitionDuration = 220,
  children,
}) => {
  const [toasts, setToasts] = useState([])

  const has = id => !!toasts.filter(toast => toast.id === id).length

  const add = (content, options = {}) => {
    const id = options.id || ueid()

    // bail if a toast exists with this ID
    if (has(id)) {
      return
    }

    const newToast = { content, id, ...options }

    // adds new toast to toasts
    setToasts(currentToasts => [...currentToasts, newToast])
  }

  const remove = id => {
    // bail if NO toasts exists with this ID
    if (!has(id)) {
      return
    }

    setToasts(currentToasts => currentToasts.filter(toast => toast.id !== id))
  }

  const removeAll = () => setToasts([])

  const update = (id, options = {}) => {
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
      {portalTarget ? (
        createPortal(
          <ToastContainer placement={placement} hasToasts={hasToasts}>
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
                        appearance={appearance}
                        autoDismiss={
                          propAutoDismiss !== undefined
                            ? propAutoDismiss
                            : autoDismiss
                        }
                        autoDismissTimeout={autoDismissTimeout}
                        Toast={Toast}
                        key={id}
                        onDismiss={() => onDismiss(id)}
                        placement={placement}
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
        )
      ) : (
        <ToastContainer placement={placement} hasToasts={hasToasts} /> // keep ReactDOM.hydrate happy
      )}
    </ToastContext.Provider>
  )
}
