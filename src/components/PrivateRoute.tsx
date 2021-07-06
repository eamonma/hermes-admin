import * as React from "react"
import { useContext } from "react"
import { Redirect, Route, RouteProps } from "react-router"
import { AppContext } from "../AppContext"

export interface ProtectedRouteProps extends RouteProps {
  path: string
}

export const PrivateRoute: React.FC<ProtectedRouteProps> = (props) => {
  const [authenticated] = useContext(AppContext).authenticated
  let redirectPath = ""

  if (!authenticated) {
    redirectPath = "/login"
  }

  if (redirectPath) {
    return <Redirect to={redirectPath} />
  } else {
    return <Route {...props} />
  }
}

export default PrivateRoute
