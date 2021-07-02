import React, { Fragment, useEffect, useRef } from "react"
// import "./App.css"
import "@vime/core/themes/default.css"
import { Player, Video } from "@vime/react"
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
} from "@apollo/client"

const client = new ApolloClient({
  uri: "http://localhost:4000/api",
  cache: new InMemoryCache(),
})

const App = () => {
  return (
    <Router>
      <ApolloProvider client={client}>
        <Navigation></Navigation>
        <Switch>
          <Route path="/login" component={Login} />
        </Switch>
      </ApolloProvider>
    </Router>
  )
}

export default App
