import { gql, useMutation } from "@apollo/client"
import { Box, Progress } from "@chakra-ui/react"
import Axios from "axios"
import mime from "mime-types"
import { normalize } from "normalize-diacritics"
import React, { Fragment, useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"

// const FILE_CHUNK_SIZE = 50_000_000
const FILE_CHUNK_SIZE = 10_000_000

const objectSum = (obj: any) => {
  let sum = 0
  for (const el in obj) {
    if (obj.hasOwnProperty(el)) {
      sum += parseInt(obj[el])
    }
  }
  return sum
}

const Dropzone = ({ project, refetch }: { project: any; refetch: any }) => {
  const [uploading, setUploading] = useState(false)

  const [multipartsProgress, setMultipartsProgress] = useState({})
  const [multipartsTotal, setMultipartsTotal] = useState(1)

  // https://www.altostra.com/blog/multipart-uploads-with-s3-presigned-url
  const uploadParts = useCallback(
    async (file: Blob, urlArray: Array<string>) => {
      const urls: Record<number, string> = {}

      urlArray.forEach((url, i) => {
        urls[i] = url
      })

      const axios = Axios.create()
      delete axios.defaults.headers.put["Content-Type"]

      const keys = Object.keys(urls)
      const promises = []

      for (const indexStr of keys) {
        const index = parseInt(indexStr)
        const start = index * FILE_CHUNK_SIZE
        const end = (index + 1) * FILE_CHUNK_SIZE
        const blob =
          index < keys.length ? file.slice(start, end) : file.slice(start)

        // const totals = [...(multipartsTotal as Array<any>)]

        // totals[index] = blob.size
        setMultipartsProgress({
          ...multipartsProgress,
          [index]: 0,
        })

        // console.log(totals)

        promises.push(
          axios.put(urls[index], blob, {
            onUploadProgress: (progressEvent) => {
              console.log(index)

              // console.log((progressEvent.loaded / progressEvent.total) * 100)
              // const progresses = console.log(progresses, index)
              // console.log(progressEvent)

              setMultipartsProgress((prev) => ({
                ...prev,
                [index]: progressEvent.loaded,
              }))

              // console.log(multipartsProgress)

              // console.log(progresses)

              // console.log(
              //   multipartsProgress?.reduce((accum, curr) => accum + curr, 0) /
              //     multipartsTotal?.reduce((accum, curr) => accum + curr, 0),
              //   multipartsProgress,
              //   multipartsTotal
              // )
            },
          })
        )
      }

      const resParts = await Promise.all(promises)

      return resParts.map((part, index) => ({
        ETag: (part as any).headers.etag,
        PartNumber: index + 1,
      }))
    },
    [multipartsProgress]
  )

  const [signedUpload, { data }] = useMutation(gql`
    mutation SignUploadUrls($parts: Int!, $key: String!) {
      signUploadUrls(parts: $parts, key: $key) {
        UploadId
        signedUrls
      }
    }
  `)

  const [completeUpload] = useMutation(gql`
    mutation CompleteUpload(
      $uploadId: String!
      $parts: [Part!]!
      $key: String!
    ) {
      completeUpload(uploadId: $uploadId, key: $key, parts: $parts)
    }
  `)

  const [createFile] = useMutation(gql`
    mutation CreateFile(
      $name: String!
      $mime: String!
      $projectId: String!
      $key: String!
    ) {
      createFile(name: $name, mime: $mime, projectId: $projectId, key: $key) {
        id
      }
    }
  `)

  const cleanupString = async (str: string) => {
    return (await normalize(str)).replaceAll(" ", "_").toLowerCase()
  }

  const onDrop = useCallback(
    async (acceptedFiles) => {
      setUploading(true)

      const { name, client, id } = project

      const { name: fileName, size } = acceptedFiles[0]
      setMultipartsTotal(size)

      const mimeType = mime.lookup(fileName)

      const key = `${await cleanupString(client)}/${await cleanupString(
        name
      )}/${await cleanupString(id)}/${await cleanupString(fileName)}`
      const partsSize = Math.floor(size / FILE_CHUNK_SIZE) + 1

      const signedItems = await signedUpload({
        variables: { key, parts: partsSize },
      })

      const parts = await uploadParts(
        acceptedFiles[0],
        signedItems.data.signUploadUrls.signedUrls
      )

      setUploading(false)

      const result = await completeUpload({
        variables: {
          uploadId: signedItems.data.signUploadUrls.UploadId,
          key,
          parts,
        },
      })

      const file = await createFile({
        variables: { name: fileName, mime: mimeType, projectId: id, key },
      })

      console.log(result)
      console.log(file.data.id)

      refetch()
    },
    [completeUpload, createFile, project, signedUpload, refetch, uploadParts]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  })

  return (
    <Fragment>
      <Box
        bg="brand.100"
        width="100%"
        p={6}
        rounded={6}
        mt={6}
        cursor="pointer"
        fontWeight="bold"
        color="gray.50"
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}{" "}
      </Box>
      <Progress
        value={(objectSum(multipartsProgress) / multipartsTotal) * 100}
      />
    </Fragment>
  )
}

export default Dropzone
