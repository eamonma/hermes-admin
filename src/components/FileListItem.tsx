import { gql, useMutation } from "@apollo/client"
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  Popover,
  PopoverArrow,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import { faFileCode } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import prettyBytes from "pretty-bytes"
import React, { Fragment, useRef, useState } from "react"

const FileListItem = ({ file, refetch }: { file: any; refetch: any }) => {
  const [deleting, setDeleting] = useState(false)
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

  const { onClose } = useDisclosure()

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
            onClick={async () => {
              const url = await signFileUrl({
                variables: {
                  id: file.id,
                },
              })
              window.location.href = url.data.signFileUrl
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
              <PopoverContent>
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
