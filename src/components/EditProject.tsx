import { gql, useQuery } from "@apollo/client"
import { ChevronRightIcon } from "@chakra-ui/icons"
import {
  Tooltip,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Checkbox,
  Flex,
  Heading,
  Input,
  SimpleGrid,
  Skeleton,
  Text,
  useToast,
} from "@chakra-ui/react"
import React, { Fragment, useState } from "react"
import { Link as RouterLink, Redirect, useParams } from "react-router-dom"
import Dropzone from "./Dropzone"
import FileListItem from "./FileListItem"

const EditProject = () => {
  const { id } = useParams() as any
  const toast = useToast()
  const [showPassphrase, setShowPassphrase] = useState(false)
  const { loading, error, data, refetch } = useQuery(
    gql`
      query Project($id: String!) {
        getProject(id: $id, clientRequesting: false) {
          shortId
          name
          client
          passphrase
          files {
            id
            name
            mime
            size
            key
          }
        }
      }
    `,
    { variables: { id } }
  )

  console.log(error)

  if ((!data && !loading) || error) return <Redirect to="/" />

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
                  : data &&
                    data.getProject.name + " (" + data.getProject.client + ")"}
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
                    <FileListItem file={file} refetch={refetch} />
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
            <Skeleton isLoaded={!loading} width="100%">
              {!loading && (
                <Fragment>
                  <Heading mb={5} as="h3" size="lg">
                    Share
                  </Heading>
                  <Checkbox
                    isChecked={showPassphrase}
                    onChange={(e) => setShowPassphrase((prev) => !prev)}
                    mb={2}
                  >
                    Include passphrase
                  </Checkbox>
                  <Tooltip label={`Click to copy, control-click to open`}>
                    <Input
                      isReadOnly
                      onClick={async (e) => {
                        if (e.metaKey || e.ctrlKey) {
                          window.open(
                            (e.target as HTMLInputElement).value,
                            "_blank"
                          )

                          return toast({
                            title: "Opened in new tab",
                            status: "success",
                            isClosable: true,
                            duration: 2000,
                          })
                        }
                        await navigator.clipboard.writeText(
                          (e.target as HTMLInputElement).value
                        )

                        toast({
                          title: "Copied to clipboard!",
                          status: "success",
                          isClosable: true,
                          duration: 900,
                        })
                      }}
                      style={{
                        cursor: "pointer",
                      }}
                      width="100%"
                      value={`${
                        process.env.NODE_ENV === "production"
                          ? process.env.PUBLIC_URL
                          : "http://localhost:3001/"
                      }${data.getProject.shortId || "no_short_id"}${
                        showPassphrase ? `?p=${data.getProject.passphrase}` : ""
                      }`}
                    />
                  </Tooltip>
                  <Heading mt={8} mb={3} as="h3" size="lg">
                    Passphrase
                  </Heading>{" "}
                  <Tooltip label={`Click to copy`}>
                    <Input
                      isReadOnly
                      onClick={async (e) => {
                        await navigator.clipboard.writeText(
                          (e.target as HTMLInputElement).value
                        )

                        toast({
                          title: "Copied to clipboard!",
                          status: "success",
                          isClosable: true,
                          duration: 900,
                        })
                      }}
                      style={{
                        cursor: "pointer",
                      }}
                      width="auto"
                      value={data.getProject.passphrase
                        .match(/.{1,4}/g)
                        .join("-")}
                    />
                  </Tooltip>
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
