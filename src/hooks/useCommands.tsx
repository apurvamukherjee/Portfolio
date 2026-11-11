import { createContext, useContext } from 'react'
import type { Command } from '../data/commands'

/** The site's action list, for surfaces too deep in the tree to take it as a prop (the hero shell). */
export const CommandsContext = createContext<Command[]>([])

export const useCommands = () => useContext(CommandsContext)
