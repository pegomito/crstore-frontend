'use client';

import {
  Box,
  VStack,
  Text,
  Icon,
  Input,
  Button,
  Flex,
  Image,
} from "@chakra-ui/react";
import { LuSquareCheck } from "react-icons/lu";
import { FaShoppingCart, FaHeart, FaUser, FaSearch } from "react-icons/fa";
import { IoShirt } from "react-icons/io5";
import { BiSolidOffer } from "react-icons/bi";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProductLayout({ children }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarSection, setSidebarSection] = useState("loja");

  return (
    <Box minH="100vh" display="flex" flexDirection="column" style={{ background: "rgba(16, 25, 43, 0.97)" }}>
      <Flex
        w="100%"
        style={{ background: "rgba(36, 53, 109, 0.97)" }}
        py={2}
        px={8}
        align="center"
        position="relative"
      >
        <Flex align="center" gap={2} minW="260px">
          <Image
            w="8%"
            justifyContent={"center"}
            src="https://sdmntprwestus.oaiusercontent.com/files/00000000-4fec-6230-9c54-6540d21c32d9/raw?se=2025-05-22T18%3A49%3A25Z&sp=r&sv=2024-08-04&sr=b&scid=1c98e6b3-db96-5288-abcf-1bbbed28bf26&skoid=e9d2f8b1-028a-4cff-8eb1-d0e66fbefcca&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-05-22T16%3A36%3A23Z&ske=2025-05-23T16%3A36%3A23Z&sks=b&skv=2024-08-04&sig=9JfjorSt/TPoByEeM2JHZtW%2BJF4OfaqolX/JnZ5txHA%3D"
          />
        </Flex>
        <Box position="relative" w="100%" maxW="700px" mx="auto">
          <Input
            variant="unstyled"
            borderRadius="md"
            border="1px solid #cfd8dc"
            placeholder="O que você está procurando?"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            pl={12}
            fontSize="lg"
            bg="#f7fafd"
            color="#222"
            height="44px"
            _placeholder={{ color: "#90a4ae" }}
            _focus={{
              borderColor: "#1976d2",
              bg: "#f0f4f8",
              boxShadow: "0 0 0 1.5px #1976d2"
            }}
            transition="all 0.2s"
            isDisabled
          />
          <Box position="absolute" left={4} top="50%" transform="translateY(-50%)">
            <FaSearch color="#90a4ae" size={18} />
          </Box>
        </Box>
        <Flex align="center" gap={6} minW="260px" justify="flex-end" ml="auto">
          <Flex align="center" color="white" cursor="pointer" _hover={{ color: "yellow.300" }}>
            <FaHeart />
            <Text ml={2} fontSize="md" display={["none", "block"]}>Lista de Desejos</Text>
          </Flex>
          <Button
            leftIcon={<FaUser />}
            colorScheme="whiteAlpha"
            variant="ghost"
            color="white"
            _hover={{ bg: "whiteAlpha.300" }}
            borderRadius="full"
            onClick={() => router.push("/Login")}
          >
            Entrar
          </Button>
          <Box position="relative" color="white" cursor="pointer">
            <FaShoppingCart size={22} />
            <Box
              position="absolute"
              top="-8px"
              right="-10px"
              bg="yellow.300"
              color="black"
              fontSize="xs"
              fontWeight="bold"
              borderRadius="full"
              px={2}
              py={0.5}
            >
              0
            </Box>
          </Box>
        </Flex>
      </Flex>
      <Box flex="1" display="flex">
        <Box
          w="220px"
          color="white"
          p={6}
          display="flex"
          flexDirection="column"
          alignItems="center"
          boxShadow="md"
          style={{ background: "rgba(36, 41, 65, 0.97)" }}
        >
          <Text fontWeight="bold" fontSize="xl" mb={8}>
            Menu
          </Text>
          <VStack spacing={6} align="stretch" w="100%">
            <Box
              as="button"
              w="100%"
              textAlign="left"
              py={2}
              px={4}
              borderRadius="md"
              bg={sidebarSection === "loja" ? "blue.600" : "transparent"}
              _hover={{ bg: "blue.600" }}
              onClick={() => setSidebarSection("loja")}
            >
              <Icon as={IoShirt} mr={2} />
              Loja
            </Box>
            <Box
              as="button"
              w="100%"
              textAlign="left"
              py={2}
              px={4}
              borderRadius="md"
              bg={sidebarSection === "carrinho" ? "blue.600" : "transparent"}
              _hover={{ bg: "blue.600" }}
              onClick={() => setSidebarSection("carrinho")}
            >
              <Icon as={FaShoppingCart} mr={2} />
              Carrinho
            </Box>
            <Box
              as="button"
              w="100%"
              textAlign="left"
              py={2}
              px={4}
              borderRadius="md"
              bg={sidebarSection === "config" ? "blue.600" : "transparent"}
              _hover={{ bg: "blue.600" }}
              onClick={() => setSidebarSection("config")}
            >
              <Icon as={LuSquareCheck} mr={2} />
              Configurações
            </Box>
            <Box
              as="button"
              w="100%"
              textAlign="left"
              py={2}
              px={4}
              borderRadius="md"
              bg={sidebarSection === "config" ? "blue.600" : "transparent"}
              _hover={{ bg: "blue.600" }}
              onClick={() => setSidebarSection("ofertas")}
            >
              <Icon as={BiSolidOffer} mr={2} />
              Ofertas
            </Box>
            <Box
              as="button"
              w="100%"
              textAlign="left"
              py={2}
              px={4}
              borderRadius="md"
              bg={sidebarSection === "carrinho" ? "blue.600" : "transparent"}
              _hover={{ bg: "blue.600" }}
              onClick={() => setSidebarSection("carrinho")}
            >
              <Icon as={FaSearch} mr={2} />
              Explorar
            </Box>
          </VStack>
        </Box>
        <Box
          flex="3"
          p={5}
          display="flex"
          flexDirection="column"
          alignItems="center"
          height="calc(100vh - 64px)"
          overflowY="auto"
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}