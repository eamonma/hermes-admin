import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightAddon,
  InputRightElement,
  Link,
} from "@chakra-ui/react"
import { Link as RouterLink } from "react-router-dom"
import React from "react"

function PasswordInput() {
  const [show, setShow] = React.useState(false)
  const handleClick = () => setShow(!show)

  return (
    <InputGroup size="md">
      <Input
        pr="4.5rem"
        type={show ? "text" : "password"}
        placeholder="Enter password"
      />
      <InputRightElement width="4.5rem">
        <Button h="1.75rem" size="sm" onClick={handleClick}>
          {show ? "Hide" : "Show"}
        </Button>
      </InputRightElement>
    </InputGroup>
  )
}

const Login = () => (
  <Flex height="100vh" justifyContent="center" alignItems="center">
    <Flex direction="column" p={12} rounded={6}>
      <Heading mb={6}>Login</Heading>
      <FormControl mb={3}>
        <FormLabel>Email</FormLabel>
        <InputGroup>
          <Input textAlign="right" placeholder="jvatougios" variant="outline" />
          <InputRightAddon children="@starlide.com" />
        </InputGroup>
      </FormControl>

      <FormControl mb={6}>
        <FormLabel>Password</FormLabel>
        <PasswordInput />
      </FormControl>

      <Flex alignItems="center" justifyContent="space-between">
        <Link as={RouterLink} to="/forgot">
          Forgot password
        </Link>
        <Button type="submit" bg="brand.100" color="gray.50">
          Login
        </Button>
      </Flex>
    </Flex>
  </Flex>
)

export default Login
