import { gql, useMutation } from "@apollo/client"
import { ArrowForwardIcon } from "@chakra-ui/icons"
import {
  Box,
  Button,
  Divider,
  Flex,
  FlexProps,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightAddon,
  InputRightElement,
  Link,
  Text,
  toast,
  useColorModeValue,
  useToast,
  VisuallyHidden,
  VStack,
} from "@chakra-ui/react"
import { Field, Form, Formik } from "formik"
import React, { useContext, useState } from "react"
import { FaGoogle } from "react-icons/fa"
import { Link as RouterLink, useHistory } from "react-router-dom"
import { AppContext } from "../AppContext"

function PasswordInput(props: any) {
  const [show, setShow] = useState(false)
  const handleClick = () => setShow(!show)

  return (
    <InputGroup size="md">
      <Input
        pr="4.5rem"
        type={show ? "text" : "password"}
        placeholder="hunter2"
        bg="white"
        {...props}
      />
      <InputRightElement width="4.5rem">
        <Button h="1.75rem" size="sm" onClick={handleClick}>
          {show ? "Hide" : "Show"}
        </Button>
      </InputRightElement>
    </InputGroup>
  )
}

export const DividerWithText = (props: FlexProps) => {
  const { children, ...flexProps } = props
  return (
    <Flex align="center" color="gray.300" {...flexProps}>
      <Box flex="1">
        <Divider borderColor="currentcolor" />
      </Box>
      <Text
        as="span"
        px="3"
        color={useColorModeValue("gray.600", "gray.400")}
        fontWeight="medium"
      >
        {children}
      </Text>
      <Box flex="1">
        <Divider borderColor="currentcolor" />
      </Box>
    </Flex>
  )
}

const Login = () => {
  const [authenticated] = useContext(AppContext).authenticated
  const toast = useToast()
  const history = useHistory()
  if (authenticated) history.push("/")

  const [login, { data }] = useMutation(gql`
    mutation ($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        id
        name
      }
    }
  `)

  return (
    <Flex height="100vh" justifyContent="center" alignItems="center">
      <Flex direction="column" p={12} rounded={6}>
        <Heading mb={6}>Login</Heading>
        <Formik
          initialValues={{ email: "", password: "" }}
          onSubmit={async (values, actions) => {
            const { email, password } = values
            const res = await login({
              variables: {
                email: email + "@starlide.com",
                password,
              },
            })

            actions.setSubmitting(false)
            console.log(res)

            if (!res.data.login) {
              toast({
                title: "Login failed",
                status: "error",
                isClosable: true,
              })
            }

            // if (res.data.login) {
            //   history.push("/me")
            // }
          }}
        >
          {(props) => (
            <Form>
              <Field name="email">
                {({ field, form }: { field: any; form: any }) => (
                  <FormControl
                    mb={6}
                    isInvalid={form.errors.email && form.touched.email}
                  >
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <InputGroup>
                      <Input
                        // bg="white"
                        {...field}
                        id="email"
                        textAlign="right"
                        placeholder="jvatougios"
                        variant="outline"
                      />
                      <InputRightAddon children="@starlide.com" />
                    </InputGroup>
                  </FormControl>
                )}
              </Field>

              {/* <FormControl mb={6}>
              <FormLabel>Password</FormLabel>
            </FormControl> */}

              <Field name="password">
                {({ field, form }: { field: any; form: any }) => (
                  <FormControl
                    mb={6}
                    isInvalid={form.errors.password && form.touched.password}
                  >
                    <Flex width="100%" justifyContent="space-between">
                      <FormLabel htmlFor="password">Password</FormLabel>
                      <Link
                        color="gray.500"
                        fontWeight="bold"
                        as={RouterLink}
                        to="/forgot"
                      >
                        Forgot password?
                      </Link>
                    </Flex>
                    <PasswordInput id="password" {...field} />
                  </FormControl>
                )}
              </Field>

              {/* <Button mt={4} colorScheme="teal" type="submit">
              Submit
            </Button> */}

              <Flex width="100%" justifyContent="flex-end">
                <Button
                  isLoading={props.isSubmitting}
                  type="submit"
                  loadingText="Login"
                  spinnerPlacement="end"
                  bg="brand.100"
                  color="white"
                  rightIcon={<ArrowForwardIcon />}
                >
                  Login
                </Button>
              </Flex>

              <DividerWithText mb="3" mt="3">
                or use
              </DividerWithText>
              <Flex width="100%" justifyContent="center">
                <Button
                  width="100%"
                  mb="6"
                  color="currentColor"
                  variant="outline"
                >
                  <VisuallyHidden>Login with Google</VisuallyHidden>
                  <FaGoogle />
                </Button>
              </Flex>
            </Form>
          )}
        </Formik>
      </Flex>
    </Flex>
  )
}

export default Login
