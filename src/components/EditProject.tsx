import { gql, useQuery } from "@apollo/client"
import { ChevronRightIcon } from "@chakra-ui/icons"
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  Heading,
  HStack,
  Input,
  SimpleGrid,
  Skeleton,
  Text,
} from "@chakra-ui/react"
import { faFileCode } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { Fragment, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Link as RouterLink, useParams } from "react-router-dom"
import Dropzone from "./Dropzone"

const EditProject = () => {
  const { id } = useParams() as any

  const { loading, error, data, refetch } = useQuery(
    gql`
      query Project($id: String!) {
        getProject(id: $id, clientRequesting: false) {
          name
          client
          passphrase
          files {
            id
            name
            mime
            key
          }
        }
      }
    `,
    { variables: { id } }
  )

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
          mb={6}
        >
          <BreadcrumbItem>
            <BreadcrumbLink as={RouterLink} to="/">
              Projects
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>
              <Skeleton isLoaded={!loading}>
                {loading
                  ? "project filler text"
                  : data.getProject.name + " (" + data.getProject.client + ")"}
              </Skeleton>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <Heading mb={12}>
          <Skeleton display="inline" isLoaded={!loading}>
            {loading ? (
              "project filler text"
            ) : (
              <Fragment>
                {data.getProject.name}{" "}
                <Text as="span" color="gray.500">
                  for {data.getProject.client + ""}
                </Text>
              </Fragment>
            )}
          </Skeleton>
        </Heading>

        <SimpleGrid width="100%" columns={2} spacing={10}>
          <Flex spacing={8} width="100%">
            <Skeleton isLoaded={!loading} width="100%">
              <Heading mb={3} as="h3" size="lg">
                Files
              </Heading>
              {loading
                ? "text"
                : data.getProject.files.map((file: any) => (
                    <HStack mt={6} mb={6} spacing={6} key={file.id}>
                      <FontAwesomeIcon icon={faFileCode} />
                      <Text fontSize="lg">{file.name}</Text>
                      <Text fontSize="lg" color="gray.500">
                        {file.mime}
                      </Text>
                    </HStack>
                  ))}
              {!loading && (
                <Dropzone
                  project={{
                    id,
                    name: data.getProject.name,
                    client: data.getProject.client,
                  }}
                  refetch={refetch}
                />
              )}
            </Skeleton>
          </Flex>
          <Flex spacing={8} width="100%">
            <Skeleton isLoaded={!loading}>
              {!loading && (
                <Fragment>
                  {" "}
                  <Heading mb={3} as="h3" size="lg">
                    Passphrase
                  </Heading>
                  <Input
                    isReadOnly
                    value={data.getProject.passphrase
                      .match(/.{1,4}/g)
                      .join("-")}
                  />
                </Fragment>
              )}
            </Skeleton>
          </Flex>
        </SimpleGrid>
      </Flex>
    </Flex>
  )
}

export default EditProject
