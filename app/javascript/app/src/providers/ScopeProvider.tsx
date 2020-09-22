import React, {
  useContext,
  createContext,
  useState,
  ReactElement,
  ReactChildren,
  ReactChild,
  useEffect,
} from 'react'
import { toCamelcase } from '../utils'
import { Deck } from '../interface'
import axios from 'axios'

const ScopeContext = createContext({
  update: (id: string | number): void => null,
  scopes: [],
  currentScope: '',
})

/**
 * Use context hook for interacting with scope.
 *
 * Must be used within a child of ScopeProvider.
 *
 * Used to determine where card crud functionality happens.
 */
export const useScope = () => {
  const { update, currentScope, scopes } = useContext(ScopeContext)

  return {
    updateScope: update,
    scopes,
    currentScope,
  }
}

interface ScopeProviderProps {
  defaultScope?: Deck | string
  children: ReactChildren | ReactChild
}

const prefix = 'mana-flood::'

const setStorage = (key: string, val: any): void => {
  const formattedVal = typeof val === 'object' ? JSON.stringify(val) : val

  window.localStorage.setItem(`${prefix}${key}`, formattedVal)
}

const getStorage = (key: string): any => {
  const val = window.localStorage.getItem(`${prefix}${key}`)

  return typeof val === 'object' ? JSON.parse(val) : val
}

/**
 * Scope context provider
 * This is used to determine where cards should be added.
 */
export const ScopeProvider = ({
  defaultScope,
  children,
}: ScopeProviderProps): ReactElement => {
  const currentScope = getStorage('scope') || defaultScope
  const scopes = getStorage('scopes') || []
  const url = getStorage('url')
  const [isLoading, setIsLoading] = useState(true)

  // Adds new toast to toast list
  const getDecks = async (): Promise<void> => {
    try {
      const response = await axios('/api/v1/decks')

      if (response.data) {
        // adds new toast to toasts
        setStorage('scopes', JSON.stringify(toCamelcase(response.data)))
      }
    } catch (error) {
      console.log('Unable to get Decks', error)
    }

    setIsLoading(false)
  }

  const update = (id: string): void => {
    const scopeId = Number(id)

    if (!scopeId) {
      setStorage('scope', 'Collection')
    } else {
      const newScope = scopes.find(scope => scope.id === scopeId)

      if (newScope) {
        setStorage('scope', newScope)
      }
    }
  }

  const initialize = () => {
    getDecks()
  }

  useEffect(() => {
    if (isLoading) {
      initialize()
    }
  }, [isLoading])

  return (
    <ScopeContext.Provider value={{ currentScope, update, scopes }}>
      {children}
    </ScopeContext.Provider>
  )
}
