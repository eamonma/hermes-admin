import { gql, useMutation } from "@apollo/client"
import {
  Button,
  ButtonGroup,
  Flex,
  Popover,
  PopoverArrow,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Text,
  useToast,
} from "@chakra-ui/react"
import { faFileCode } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import prettyBytes from "pretty-bytes"
import React, { Fragment, useRef, useState } from "react"

const FileListItem = ({ file, refetch }: { file: any; refetch: any }) => {
  const [deleting, setDeleting] = useState(false)
  const [loadingURL, setLoadingURL] = useState(false)
  const [removeFile] = useMutation(gql`
    mutation deleteFile($id: String!) {
      deleteFile(id: $id)
    }
  `)

  const [signFileUrl] = useMutation(gql`
    mutation signFileUrl($id: String!) {
      signFileUrl(id: $id, clientRequesting: false)
    }
  `)

  const toast = useToast()

  const initRef = useRef<HTMLButtonElement>(null)

  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      mt={6}
      mb={6}
      spacing={6}
      key={file.id}
    >
      <Flex alignItems="center">
        <FontAwesomeIcon icon={faFileCode} />
        <Text fontSize="lg" ml={3}>
          <Button
            variant="outline"
            isLoading={loadingURL}
            onClick={async () => {
              setLoadingURL(true)
              const url = await signFileUrl({
                variables: {
                  id: file.id,
                },
              })
              window.location.href = url.data.signFileUrl
              setLoadingURL(false)
            }}
          >
            {file.name}
          </Button>
        </Text>
      </Flex>

      <Flex alignItems="center">
        <Text fontSize="lg" color="gray.500" mr={6}>
          {file.mime}
        </Text>
        <Text fontSize="lg" color="gray.500" mr={6}>
          {prettyBytes(file.size)}
        </Text>
        <Popover initialFocusRef={initRef}>
          {({ onClose }) => (
            <Fragment>
              <PopoverTrigger>
                <Button bg="red.600" color="gray.50">
                  Delete
                </Button>
              </PopoverTrigger>
              <PopoverContent
                style={{
                  boxShadow: "1px 1px 18px -10px rgba(1,1,1,0.5)",
                }}
              >
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader>Are you sure?</PopoverHeader>
                <PopoverFooter d="flex" justifyContent="flex-end">
                  <ButtonGroup size="sm">
                    <Button variant="outline" ref={initRef} onClick={onClose}>
                      Cancel
                    </Button>
                    <Button
                      colorScheme="red"
                      onClick={async () => {
                        setDeleting(true)
                        await removeFile({
                          variables: {
                            id: file.id,
                          },
                        })
                        await refetch()
                        setDeleting(false)
                        toast({
                          title: `${file.name} deleted`,
                          status: "success",
                          isClosable: true,
                        })
                      }}
                      isLoading={deleting}
                    >
                      Yes, delete
                    </Button>
                  </ButtonGroup>
                </PopoverFooter>
              </PopoverContent>
            </Fragment>
          )}
        </Popover>
      </Flex>
    </Flex>
  )
}

export default FileListItem
