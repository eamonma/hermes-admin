import { gql, useQuery } from "@apollo/client"
import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons"
import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Image,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import { ReactNode } from "react"
import { Link as RouterLink } from "react-router-dom"
import Logo from "../assets/images/filled-in.png"

const Links = [
  {
    title: "Projects",
    to: "/",
  },
  {
    title: "New project",
    to: "/projects/new",
  },
]

const NavLink = ({ children, to }: { children: ReactNode; to: string }) => (
  <Link
    px={2}
    py={1}
    size="lg"
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      bg: useColorModeValue("gray.200", "gray.700"),
    }}
    as={RouterLink}
    to={to}
  >
    {children}
  </Link>
)

export default function Navigation() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { loading, error, data } = useQuery(gql`
    query {
      me {
        name
      }
    }
  `)

  return (
    <>
      <Box
        position="fixed"
        top={0}
        width="100vw"
        bg={useColorModeValue("gray.100", "gray.900")}
        px={4}
      >
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <Box>
              <RouterLink to="/">
                <Image src={Logo} boxSize="40px" />
              </RouterLink>
            </Box>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {Links.map((link) => (
                <NavLink key={link.to} to={link.to}>
                  {link.title}
                </NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={"center"}>
            <Menu>
              <MenuButton
                as={Button}
                // rounded={"full"}
                // variant={"link"}
                bg="gray.200"
                cursor={"pointer"}
              >
                {!loading && !error && data.me.name}
                {/* <Avatar size={"sm"} src={"https://gravatar.com/avatar/1"} /> */}
              </MenuButton>
              <MenuList>
                {/* <MenuItem>Link 1</MenuItem>
                <MenuItem>Link 2</MenuItem>
                <MenuDivider /> */}
                <MenuItem>
                  <Link width="100%" as={RouterLink} to="/logout">
                    Logout
                  </Link>
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link.to} to={link.to}>
                  {link.title}
                </NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  )
}
