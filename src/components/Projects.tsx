import { gql, useQuery } from "@apollo/client"
import {
  Button,
  Flex,
  Heading,
  Input,
  Link,
  Skeleton,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react"
import React, { Fragment, useState } from "react"
import { Link as RouterLink, useHistory } from "react-router-dom"

const Projects = () => {
  const history = useHistory()
  const [filter, setFilter] = useState("")
  const { loading, data } = useQuery(gql`
    query {
      me {
        projects {
          client
          name
          createdAt
          id
        }
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
        <Heading mb={6}>Projects</Heading>
        <Flex
          width="100%"
          maxWidth="800px"
          alignItems="center"
          justifyContent="space-between"
          mb={6}
        >
          <Input
            variant="flushed"
            placeholder="Search"
            size="lg"
            mr={6}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            autoFocus
          />
          <Button
            size="lg"
            onClick={() => {
              history.push("/projects/new")
            }}
          >
            New project
          </Button>
        </Flex>
        <Table variant="simple" width="100%" maxWidth="800px">
          {/* <TableCaption>Imperial to metric conversion factors</TableCaption> */}
          <Thead>
            <Tr>
              <Th>Created on</Th>
              <Th>Client</Th>
              <Th>Project</Th>
              <Th></Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {loading ? (
              <Tr>
                <Td>
                  <Skeleton height={6} />
                </Td>
                <Td>
                  <Skeleton height={6} />
                </Td>
                <Td>
                  <Skeleton height={6} />
                </Td>
                <Td>
                  <Skeleton height={6} />
                </Td>
                <Td>
                  <Skeleton height={6} />
                </Td>
              </Tr>
            ) : (
              typeof filter &&
              data &&
              data.me.projects.map(({ client, name, createdAt, id }: any) => {
                const str = (
                  `${client} ${name} ${createdAt} ${id}` as string
                ).toLowerCase()
                console.log(str)

                if (!str.includes(filter.toLowerCase()))
                  return <Fragment key={id}></Fragment>
                return (
                  <Tr key={id}>
                    <Td>{new Date(createdAt).toLocaleDateString()}</Td>
                    <Td>
                      <Text isTruncated>{client}</Text>
                    </Td>
                    <Td>
                      <Link as={RouterLink} to={`/projects/${id}`}>
                        {name}
                      </Link>
                    </Td>
                    <Td>
                      {/* <ButtonGroup> */}
                      <Button
                        onClick={() => {
                          history.push(`/projects/${id}`)
                        }}
                      >
                        View
                      </Button>
                    </Td>
                    <Td>
                      {/* <ButtonGroup> */}
                      <Button
                        onClick={() => {
                          history.push(`/projects/${id}`)
                        }}
                        bg="brand.100"
                        color="gray.50"
                      >
                        Share
                      </Button>
                      {/* </ButtonGroup> */}
                    </Td>
                  </Tr>
                )
              })
            )}
          </Tbody>
        </Table>
      </Flex>
    </Flex>
  )
}

export default Projects
