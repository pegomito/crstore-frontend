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
  Center,
  HStack
} from "@chakra-ui/react";
import { LuSquareCheck } from "react-icons/lu";
import { FaShoppingCart, FaHeart, FaUser, FaSearch } from "react-icons/fa";
import { IoShirt } from "react-icons/io5";
import ProductCarousel from "@/components/Carousel";
import api from "@/utils/axios";
import ProductCard from "@/components/ProductCard";
import { BiSolidOffer, BiSolidCategoryAlt } from "react-icons/bi";  
import { RiAdminFill } from "react-icons/ri";
import { CiUser } from "react-icons/ci";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";


const tiposRoupas = [
  { id: null, name: "Todos" },
  { id: 1, name: "Camisetas" },
  { id: 2, name: "Calças" },
  { id: 3, name: "Tênis" },
  { id: 4, name: "Acessórios" }
];

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
      style={{ background: "rgba(27, 52, 97, 0.97)" }}
      color={current ? "rgba(255, 255, 255, 0.97)" : "rgba(94, 135, 161, 0.97)"}
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

 
  const produtosFiltrados = produtos.filter(prod => {

    const categoriaOk =
      tabValue.id === null ||
      prod.category === tabValue.id ||
      prod.category?.id === tabValue.id;

    const buscaOk =
      !searchTerm ||
      prod.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.description?.toLowerCase().includes(searchTerm.toLowerCase());

    return categoriaOk && buscaOk;
  });

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
      
          <Image
            maxW={"50%"}
            w="8%"
            justifyContent={"center"}
            src="https://sdmntprsouthcentralus.oaiusercontent.com/files/00000000-a1d8-61f7-8811-8cdce9d52ee1/raw?se=2025-05-22T21%3A51%3A01Z&sp=r&sv=2024-08-04&sr=b&scid=5518ea66-fb7d-55dd-8408-bb29e347682f&skoid=5cab1ff4-c20d-41dc-babb-df0c2cc21dd4&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-05-22T11%3A04%3A39Z&ske=2025-05-23T11%3A04%3A39Z&sks=b&skv=2024-08-04&sig=xzy1Pr2of4cM54w9MAO/82O1tpSKExNsxkTpbtubwPE%3D"
             cursor="pointer"
             onClick={() => router.refresh()}
          />
       
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
            onClick={() => router.push("/Login")}
          >
            Entrar
          </Button>
          <Box position="relative" color="white" cursor="pointer">
            <FaShoppingCart size={22} />
            <Box
              position="absolute"
            >
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
              bg={sidebarSection === "ofertas" ? "blue.600" : "transparent"}
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
              bg={sidebarSection === "explorar" ? "blue.600" : "transparent"}
              _hover={{ bg: "blue.600" }}
              onClick={() => setSidebarSection("explorar")}
            >
              <Icon as={FaSearch } mr={2} />
              Explorar
            </Box>
            <Box
              as="button"
              w="100%"
              textAlign="left"
              py={2}
              px={4}
              borderRadius="md"
              bg={sidebarSection === "admin" ? "blue.600" : "transparent"}
              _hover={{ bg: "blue.600" }}
              onClick={() => setSidebarSection("admin")}
            >
              <Icon as={RiAdminFill } mr={2} />
             Administração
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
          {sidebarSection === "loja" && (
            <Box flex="1" p={8} display="flex" flexDirection="column" alignItems="center" w="100%">
              <TabsRoot value={tabValue} onValueChange={setTabValue}>
                {({ value, onValueChange }) => (
                  <>
                    <TabsList>
                      {tiposRoupas.map((tipo, idx) => (
                        <TabsTrigger
                          key={tipo.id ?? "todos"}
                          value={tipo}
                          current={tabValue.id === tipo.id}
                          onClick={setTabValue}
                        >
                          {tipo.name}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    <TabsContent value={tabValue} current={true}>
                      <ProductCarousel produtos={produtosFiltrados} />
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
          {sidebarSection === "ofertas" && (
            <Text color="white" fontSize="2xl" mt={10}>
              -
            </Text>
          )}
          {sidebarSection === "explorar" && (
            <Text color="white" fontSize="2xl" mt={10}>
              -
            </Text>
          )}
          {sidebarSection === "admin" && (
            <Box
              flex="1"
            >
            <VStack spacing={4} align="center" mb={6}>
              <Text color="white" fontSize="2xl" mt={10} textAlign="center" fontWeight="bold">
                Bem-Vindo à área de administração!
              </Text>
              <Flex wrap="wrap" gap={4}  justify="center">
              <Button
                mt={10}
                onClick={() => router.push("/tasksUser")}
                p={8}
              >
                Gerenciar Usuários
                <CiUser />
              </Button>
              <Button
                mt={10}
                onClick={() => router.push("/tasksProducts")}
                p={8}
              >
                Gerenciar Produtos
                <MdOutlineProductionQuantityLimits />
              </Button>
              <Button
                mt={10}
                onClick={() => router.push("/tasksCategories")}
                p={8}
              >
                Gerenciar Categorias
                <BiSolidCategoryAlt />
              </Button>
              <Button
                mt={10}
                onClick={() => router.push("/tasksPayment")}
                p={8}
              >
                Gerenciar Métodos de Pagamento
                <MdOutlineProductionQuantityLimits />
              </Button>
              <Button
                mt={10}
                onClick={() => router.push("/tasksOrder_Products")}
                p={8}
              >
                Gerenciar  Pedidos/Produtos
                <MdOutlineProductionQuantityLimits />
              </Button>
              <Button
                mt={10}
                onClick={() => router.push("/tasksOrder")}
                p={8}
              >
                Gerenciar Pedidos
                <MdOutlineProductionQuantityLimits />
              </Button>
              <Button
                mt={10}
                onClick={() => router.push("/tasksCoupons")}
                p={8}
              >
                Gerenciar Cupoms
                <MdOutlineProductionQuantityLimits />
              </Button>
              <Button
                mt={10}
                onClick={() => router.push("/tasksAdress")}
                p={8}
              >
                Gerenciar Endereços
                <MdOutlineProductionQuantityLimits />
              </Button>


              </Flex>
            </VStack>
          </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default tabInicial;