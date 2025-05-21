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
  Spinner,
  Center
} from "@chakra-ui/react";
import { LuSquareCheck } from "react-icons/lu";
import { FaShoppingCart, FaHeart, FaUser, FaSearch } from "react-icons/fa";
import { IoShirt } from "react-icons/io5";
import ProductCarousel from "@/components/Carousel";
import api from "@/utils/axios";
import ProductCard from "@/components/ProductCard";
import { BiSolidOffer } from "react-icons/bi";


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
      onClick={() => onClick(value)}
      borderRadius="lg"
      fontWeight="bold"
      px={10}
      py={7}
      fontSize="xl"
      style={{ background: "rgba(78, 111, 160, 0.97)" }}
      color={current ? "rgba(255, 255, 255, 0.97)" : "rgba(148, 175, 211, 0.97)"}
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
  const [produtos, setProdutos] = useState([]);
  const [loadingProdutos, setLoadingProdutos] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.replace("/Login");
    }
  }, [router]);

  useEffect(() => {
    setLoadingProdutos(true);
    api.get("/products")
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : res.data.data || [];
        setProdutos(data);
        setLoadingProdutos(false);
      })
      .catch(() => setLoadingProdutos(false));
  }, []);

  const tabIndex = tiposRoupas.indexOf(tabValue);

  // Filtro por tipo de roupa (categoria)
  const produtosFiltrados = tabValue === "Todos"
    ? produtos
    : produtos.filter(prod => prod.category?.name === tabValue);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" style={{ background: "rgba(16, 25, 43, 0.97)" }}>
      {/* Header */}
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
            src="https://sdmntprwestus.oaiusercontent.com/files/00000000-4fec-6230-9c54-6540d21c32d9/raw?se=2025-05-21T22%3A22%3A46Z&sp=r&sv=2024-08-04&sr=b&scid=28e3c5c9-0f14-59b2-91a9-2066715d822b&skoid=b64a43d9-3512-45c2-98b4-dea55d094240&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-05-21T20%3A19%3A29Z&ske=2025-05-22T20%3A19%3A29Z&sks=b&skv=2024-08-04&sig=JAGWGeWqgBGFGnIspCYvLZ/6Ic5eAmMectZJ94AUFu8%3D"
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

      {/* Conteúdo */}
      <Box flex="1" display="flex">
        {/* Sidebar */}
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
              onClick={() => setSidebarSection("config")}
            >
              <Icon as={BiSolidOffer} mr={2} />
              Ofertas
            </Box>
          </VStack>
        </Box>

        {/* Conteúdo principal rolável */}
        <Box
          flex="3"
          p={5}
          display="flex"
          flexDirection="column"
          alignItems="center"
          height="calc(100vh - 64px)" // ajuste 64px para a altura do header
          overflowY="auto"
        >
          {sidebarSection === "loja" && (
            <Box flex="1" p={8} display="flex" flexDirection="column" alignItems="center" w="100%">
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
                        {/* Carrossel */}
                        <ProductCarousel tipoSelecionado={tipo} />
                        {/* Cards de produtos */}
                        {loadingProdutos ? (
                          <Center py={10}><Spinner size="lg" color="yellow.300" /></Center>
                        ) : (
                            <Flex wrap="wrap" gap={6} justify="center" mt={8}>
                              {produtosFiltrados.length === 0 ? (
                                <Text color="white" fontSize="lg">Nenhum produto encontrado.</Text>
                              ) : (
                                produtosFiltrados.map(prod => (
                                  <ProductCard key={prod.id} prod={prod} />
                                ))
                              )}
                            </Flex>
                        )}
                      </TabsContent>
                    ))}
                  </>
                )}
              </TabsRoot>
            </Box>
          )}
          {sidebarSection === "carrinho" && (
            <Text color="white" fontSize="2xl" mt={10}>
              -
            </Text>
          )}
          {sidebarSection === "config" && (
            <Text color="white" fontSize="2xl" mt={10}>
              -
            </Text>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default tabInicial;