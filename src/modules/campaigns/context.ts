import { createContext } from 'react'
import { ProviderContextValue } from './types.ts'

export const ProviderContext = createContext<ProviderContextValue | undefined>(undefined)
