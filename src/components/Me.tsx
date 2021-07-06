import { gql, useQuery } from "@apollo/client"
import { Flex, Heading } from "@chakra-ui/react"
import React from "react"

const Me = () => {
  const { loading, error, data } = useQuery(gql`
    query {
      me {
        name
      }
    }
  `)

  return (
    <Flex height="100vh" mt={6}>
      <Flex direction="column" p={12} rounded={6}>
        <Heading mb={6}>Me</Heading>

        {!loading && !error && data.me.name}
      </Flex>
    </Flex>
  )
}

export default Me
