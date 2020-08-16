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
  update: (id: string | number, options = {}): void => null,
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

/**
 * Scope context provider
 * This is used to determine where cards should be added.
 */
export const ScopeProvider = ({
  defaultScope,
  children,
}: ScopeProviderProps): ReactElement => {
  const [currentScope, setCurrentScope] = useState(defaultScope || 'collection')
  const [scopes, setScopes] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Adds new toast to toast list
  const getDecks = async (): Promise<void> => {
    try {
      const response = await axios('/api/v1/decks')

      if (response.data) {
        // adds new toast to toasts
        setScopes(toCamelcase(response.data))
      }
    } catch (error) {
      console.log('Unable to get Decks', error)
    }

    setIsLoading(false)
  }

  const update = (id: string): void => {
    const scopeId = Number(id)

    if (!scopeId) {
      setCurrentScope('Collection')
    } else {
      const newScope = scopes.find(scope => scope.id === scopeId)

      if (newScope) {
        setCurrentScope(newScope)
      }
    }
  }

  useEffect(() => {
    if (isLoading) {
      getDecks()
    }
  }, [isLoading])

  return (
    <ScopeContext.Provider value={{ currentScope, update, scopes }}>
      {children}
    </ScopeContext.Provider>
  )
}
