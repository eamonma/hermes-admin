import { gql, useMutation } from "@apollo/client"
import { ArrowForwardIcon, ChevronRightIcon } from "@chakra-ui/icons"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  Text,
} from "@chakra-ui/react"
import { Field, Form, Formik } from "formik"
import React from "react"
import { Link as RouterLink, useHistory } from "react-router-dom"

const Me = () => {
  // const { id } = useParams() as any

  // const { loading, error, data } = useQuery(
  //   gql`
  //     query Project($id: String!) {
  //       getProject(id: $id, clientRequesting: false) {
  //         name
  //         client
  //       }
  //     }
  //   `,
  //   { variables: { id } }
  // )

  const history = useHistory()

  const [createProject, { data }] = useMutation(gql`
    mutation ($name: String!, $client: String!) {
      createProject(name: $name, client: $client) {
        id
      }
    }
  `)

  return (
    <Flex height="100vh" mt={12} width="100vw">
      <Flex
        direction="column"
        p={12}
        rounded={6}
        width="100vw"
        alignItems="center"
      >
        <Breadcrumb
          alignSelf="flex-start"
          separator={<ChevronRightIcon color="gray.500" />}
        >
          <BreadcrumbItem>
            <BreadcrumbLink as={RouterLink} to="/">
              Projects
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>New project</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <Heading mb={6}>
          <Text as="span" color="gray.500">
            New project
          </Text>
        </Heading>
        <Formik
          initialValues={{ name: "", client: "" }}
          onSubmit={async (values, actions) => {
            const { name, client } = values
            const res = await createProject({
              variables: {
                name,
                client,
              },
            })

            actions.setSubmitting(false)

            if (res.data) history.push(`/projects/${res.data.createProject.id}`)
          }}
        >
          {(props) => (
            <Form>
              <Field name="name">
                {({ field, form }: { field: any; form: any }) => (
                  <FormControl
                    mb={6}
                    isInvalid={form.errors.name && form.touched.name}
                  >
                    <FormLabel htmlFor="name">Name</FormLabel>
                    <InputGroup>
                      <Input
                        // bg="white"
                        {...field}
                        id="name"
                        textAlign="left"
                        placeholder=""
                        variant="outline"
                      />
                    </InputGroup>
                  </FormControl>
                )}
              </Field>

              {/* <FormControl mb={6}>
              <FormLabel>Password</FormLabel>
            </FormControl> */}

              <Field name="client">
                {({ field, form }: { field: any; form: any }) => (
                  <FormControl
                    mb={6}
                    isInvalid={form.errors.client && form.touched.client}
                  >
                    <Flex width="100%" justifyContent="space-between">
                      <FormLabel htmlFor="client">Client</FormLabel>
                    </Flex>
                    <Input
                      {...field}
                      id="password"
                      textAlign="left"
                      placeholder=""
                      variant="outline"
                    />
                  </FormControl>
                )}
              </Field>

              <Flex width="100%" justifyContent="flex-end">
                <Button
                  isLoading={props.isSubmitting}
                  type="submit"
                  loadingText="Create"
                  spinnerPlacement="end"
                  rightIcon={<ArrowForwardIcon />}
                >
                  Create
                </Button>
              </Flex>
            </Form>
          )}
        </Formik>
      </Flex>
    </Flex>
  )
}

export default Me
