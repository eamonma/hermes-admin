import React, { Fragment, useContext, useEffect, useRef } from "react"
// import "./App.css"
import "@vime/core/themes/default.css"
import { Button } from "@chakra-ui/react"
import { BrowserRouter as Router } from "react-router-dom"
import { Route, Switch } from "react-router"
import Login from "./components/Login"
import Navigation from "./components/Navigation"

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
  ApolloLink,
  createHttpLink,
} from "@apollo/client"

import { setContext } from "@apollo/client/link/context"
import { AppContext, AppProvider } from "./AppContext"
import Me from "./components/Me"
import Projects from "./components/Projects"
import PrivateRoute from "./components/PrivateRoute"
import Logout from "./components/Logout"
import EditProject from "./components/EditProject"
import NewProject from "./components/NewProject"

const setAuthLink = setContext(() => {})

const App = () => {
  return (
    <Router>
      <AppProvider>
        <AppRouter />
      </AppProvider>
    </Router>
  )
}

const AppRouter = () => {
  const [authenticated, setAuthenticated] = useContext(AppContext).authenticated
  const [token, setToken] = useContext(AppContext).token
  const [refreshToken, setRefreshToken] = useContext(AppContext).refreshToken

  const afterwareLink = new ApolloLink((operation, forward) => {
    return forward(operation).map((response) => {
      const context = operation.getContext()
      const {
        response: { headers },
      } = context

      if (headers) {
        const tokenHeader = context.response.headers.get("Token")
        if (tokenHeader) {
          localStorage.setItem("token", tokenHeader)
          setToken(tokenHeader)
        }
        const refreshHeader = context.response.headers.get("Refresh-Token")
        if (refreshHeader) {
          localStorage.setItem("refreshToken", refreshHeader)
          setRefreshToken(refreshHeader)
        }

        if (tokenHeader && refreshHeader) {
          localStorage.setItem("authenticated", "true")
          setAuthenticated(true)
        }
      }

      return response
    })
  })

  const httpLink = createHttpLink({
    uri: "http://localhost:4000/api",
  })

  const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
        "Refresh-Token": refreshToken ? refreshToken : "",
      },
    }
  })

  // https://dev.to/tmaximini/accessing-authorization-headers-in-apollo-graphql-client-3b50
  const client = new ApolloClient({
    link: ApolloLink.from([authLink, afterwareLink.concat(httpLink)]),
    cache: new InMemoryCache(),
  })

  useEffect(() => {
    const authenticated = JSON.parse(
      localStorage.getItem("authenticated") as string
    )
    const authToken = localStorage.getItem("token")
    const refreshToken = localStorage.getItem("refreshToken")

    if (authenticated) setAuthenticated(authenticated)
    if (authToken) setToken(authToken)
    if (refreshToken) setRefreshToken(refreshToken)
  }, [setToken, setRefreshToken, setAuthenticated])

  return (
    <ApolloProvider client={client}>
      {authenticated && <Navigation />}
      <Switch>
        <PrivateRoute path="/me" component={Me} />
        <PrivateRoute path="/" exact component={Projects} />
        <PrivateRoute path="/projects/new" exact component={NewProject} />
        <PrivateRoute path="/projects/:id" component={EditProject} />
        <PrivateRoute path="/logout" component={Logout} />
        <Route path="/login" component={Login} />
      </Switch>
    </ApolloProvider>
  )
}

export default App
