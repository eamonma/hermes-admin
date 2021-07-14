import React, { useState, createContext, ReactChild } from "react"

export const AppContext = createContext({} as any)

export const AppProvider = (props: { children: ReactChild }) => {
  let auth: boolean = JSON.parse(
    localStorage.getItem("authenticated") as string
  ) as boolean
  const [authenticated, setAuthenticated] = useState(auth)
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
