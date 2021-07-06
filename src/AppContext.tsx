import React, { useState, createContext, ReactChild } from "react"

export const AppContext = createContext({} as any)

export const AppProvider = (props: { children: ReactChild }) => {
  const [authenticated, setAuthenticated] = useState(true)
  const [token, setToken] = useState("")
  const [refreshToken, setRefreshToken] = useState("")

  return (
    <AppContext.Provider
      value={{
        authenticated: [authenticated, setAuthenticated],
        token: [token, setToken],
        refreshToken: [refreshToken, setRefreshToken],
      }}
    >
      {props.children}
    </AppContext.Provider>
  )
}
