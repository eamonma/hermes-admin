import React, { useState, createContext, ReactChild } from "react"

export const AppContext = createContext({} as any)

export const AppProvider = (props: { children: ReactChild }) => {
  const [authenticated, setAuthenticated] = useState(false)
  const [token, setToken] = useState("")
  const [user, setUser] = useState({})

  return (
    <AppContext.Provider
      value={{
        authenticated: [authenticated, setAuthenticated],
        token: [token, setToken],
        user: [user, setUser],
      }}
    >
      {props.children}
    </AppContext.Provider>
  )
}
