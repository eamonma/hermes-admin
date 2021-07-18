import { Flex, Heading } from "@chakra-ui/react"
import React, { useContext, useEffect } from "react"
import { useHistory } from "react-router-dom"
import { AppContext } from "../AppContext"

const Logout = () => {
  const history = useHistory()
  const [, setAuthenticated] = useContext(AppContext).authenticated
  const [, setToken] = useContext(AppContext).token
  const [, setRefreshToken] = useContext(AppContext).refreshToken

  // const { loading, error, data } = useQuery(gql`
  //   query {
  //     me {
  //       name
  //     }
  //   }
  // `)

  useEffect(() => {
    localStorage.setItem("token", "")
    localStorage.setItem("refreshToken", "")
    localStorage.setItem("authenticated", "false")

    setAuthenticated(false)
    setToken("")
    setRefreshToken("")

    history.push("/login")
  }, [history, setAuthenticated, setToken, setRefreshToken])

  return (
    <Flex height="100vh" mt={6}>
      <Flex direction="column" p={12} rounded={6}>
        <Heading mb={6}>Logging out...</Heading>
      </Flex>
    </Flex>
  )
}

export default Logout
