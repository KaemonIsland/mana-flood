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

interface Update {
  (id: string | number): void
}

interface ScopeContextTypes {
  updateScope: Update
  currentScope: Deck | string
  scopes: Array<Deck>
}

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
export const useScope = (): ScopeContextTypes => {
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

  try {
    return JSON.parse(val)
  } catch (error) {
    // Could not parse value
    return val
  }
}

/**
 * Scope context provider
 * This is used to determine where cards should be added.
 */
export const ScopeProvider = ({
  defaultScope,
  children,
}: ScopeProviderProps): ReactElement => {
  const [isLoading, setIsLoading] = useState(true)
  const [scopes, setScopes] = useState(getStorage('scopes') || [])
  const [currentScope, setCurrentScope] = useState(
    getStorage('scope') || defaultScope
  )

  // Fetches and adds user decklist to scopes
  const getDecks = async (): Promise<void> => {
    try {
      const response = await axios('/api/v1/decks')

      if (response.data) {
        const decks = toCamelcase(response.data)
        // Sets decklist to scopes
        setScopes(decks)
        setStorage('scopes', decks)
      }
    } catch (error) {
      console.log('Unable to get Decks', error)
    }

    setIsLoading(false)
  }

  const update = (id: string): void => {
    const scopeId = Number(id)

    if (!scopeId) {
      // sets scope to collection
      setCurrentScope('Collection')
      setStorage('scope', 'Collection')
    } else {
      const newScope = scopes.find(scope => scope.id === scopeId)

      if (newScope) {
        // Updates current scope
        setCurrentScope(newScope)
        setStorage('scope', newScope)
      }
    }
  }

  const initialize = () => {
    getDecks()
    const pathname = window.location.pathname
    // Updates URL
    setStorage('url', pathname)

    const newScope = scopes.find(
      scope => scope.id === defaultScope && defaultScope.id
    )

    // Updates Scope
    setCurrentScope(newScope || 'Collection')
    setStorage('scope', defaultScope || 'Collection')
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
