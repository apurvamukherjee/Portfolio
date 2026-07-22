import { createContext, useContext } from 'react'

/** True once the intro preloader (if any) has finished — gates Hero/Navbar entrance animations. */
export const IntroContext = createContext(true)

export const useIntro = () => useContext(IntroContext)
