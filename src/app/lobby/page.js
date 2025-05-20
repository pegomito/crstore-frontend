'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import ProductCarousel from "@/components/Carousel";

const tiposRoupas = ["Todos", "Camisetas", "Calças", "Tênis", "Acessórios"];

// Componentes auxiliares para Tabs no padrão solicitado
function TabsRoot({ value, onValueChange, children }) {
  return <Box>{children({ value, onValueChange })}</Box>;
}
function TabsList({ children }) {
  return (
    <Flex
      mb={6}
      gap={4}
      justify="center"
      w="100%"
    >
      {children}
    </Flex>
  );
}
function TabsTrigger({ value, current, onClick, children }) {
  return (
    <Button
      variant={current ? "solid" : "outline"}
      colorScheme="blue"
      onClick={() => onClick(value)}
      borderRadius="lg"
      fontWeight="bold"
      px={10}
      py={7}
      fontSize="xl"
      bg={current ? "#1976d2" : "#e3f2fd"}
      color={current ? "white" : "#1976d2"}
      _hover={{
        bg: current ? "#1565c0" : "#bbdefb",
      }}
      boxShadow="md"
      transition="all 0.2s"
      minW="140px"
    >
      {children}
    </Button>
  );
}
function TabsIndicator({ index, total }) {
  return (
    <Box
      mt={1}
      h="4px"
      w={`${100 / total}%`}
      bg="blue.500"
      borderRadius="full"
      position="relative"
      left={`${(100 / total) * index}%`}
      transition="left 0.2s"
    />
  );
}
function TabsContent({ value, current, children }) {
  return current ? <Box w="100%">{children}</Box> : null;
}

const tabInicial = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarSection, setSidebarSection] = useState("loja");
  const [tabValue, setTabValue] = useState(tiposRoupas[0]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.replace("/Login");
    }
  }, [router]);

  const tabIndex = tiposRoupas.indexOf(tabValue);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" style={{ background: "rgba(9, 10, 17, 0.97)" }}>
      <Flex
        w="100%"
        style={{ background: "rgba(31, 29, 141, 0.97)" }}
        py={2}
        px={8}
        align="center"
        position="relative"
      >   
        <Flex align="center" gap={2} minW="260px">
          <Image
            w="8%"
            src="https://www.pngplay.com/wp-content/uploads/13/Jordan-Logo-PNG-Clipart-Background.png"
          />
        </Flex>
        <Box
          position="absolute"
          left="50%"
          top="50%"
          transform="translate(-50%, -50%)"
          maxW="500px"
          w="100%"
          zIndex={1}
        
        >
          <Box position="relative">
            <Input
              bg="white"
              placeholder="O que você está procurando?"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              pl={10}
              fontSize="lg"
              _placeholder={{ color: "gray.500" }}
            />
            <Box position="absolute" left={4} top="50%" transform="translateY(-50%)">
              <FaSearch color="#8000FF" />
            </Box>
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

      {/* Resto da página */}
      <Box flex="1" display="flex">
        {/* Sidebar permanente */}
        <Box
          w="220px"
          color="white"
          p={6}
          display="flex"
          flexDirection="column"
          alignItems="center"
          boxShadow="md"
          style={{ background: "rgba(44, 44, 44, 0.97)" }}
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
          </VStack>
        </Box>

        {/* Conteúdo principal */}
        <Box flex="3" p={5} display="flex" flexDirection="column" alignItems="center">
          {sidebarSection === "loja" && (
            <Box flex="1" p={8} display="flex" flexDirection="column" alignItems="center">
              <TabsRoot value={tabValue} onValueChange={setTabValue}>
                {({ value, onValueChange }) => (
                  <>
                    <TabsList>
                      {tiposRoupas.map((tipo, idx) => (
                        <TabsTrigger
                          key={tipo}
                          value={tipo}
                          current={value === tipo}
                          onClick={onValueChange}
                        >
                          {tipo}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    <TabsIndicator index={tabIndex} total={tiposRoupas.length} />
                    {tiposRoupas.map((tipo) => (
                      <TabsContent key={tipo} value={tipo} current={value === tipo}>
                        <ProductCarousel tipoSelecionado={tipo} />
                      </TabsContent>
                    ))}
                  </>
                )}
              </TabsRoot>
            </Box>
          )}
          {sidebarSection === "carrinho" && (
            <Text color="white" fontSize="2xl" mt={10}>
              Carrinho principal selecionado!
            </Text>
          )}
          {sidebarSection === "config" && (
            <Text color="white" fontSize="2xl" mt={10}>
              Configurações selecionado!
            </Text>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default tabInicial;