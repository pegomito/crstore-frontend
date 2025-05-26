'use client';
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  VStack,
  Text,
  Input,
  Flex,
 
} from "@chakra-ui/react";
import { toaster } from "./ui/toaster";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [address, setAddress] = useState({
    zipCode: "",
    state: "",
    city: "",
    street: "",
    district: "",
    numberForget: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(cart);
  }, []);

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/adresses", address);
      
      setAddress({
        zipCode: "",
        state: "",
        city: "",
        street: "",
        district: "",
        numberForget: "",
      });
      localStorage.removeItem("cart");
      setCartItems([]);
      toaster.create({
        title: "Erro ao cadastrar endereço",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      alert("Erro ao cadastrar endereço");
    } finally {
      setLoading(false);
    }
  };

  const total = cartItems.reduce((sum, item) => sum + Number(item.price), 0);

  return (
    <Box w="100%" maxW="500px" mx="auto" mt={8} p={6} bg="whiteAlpha.100" borderRadius="lg" boxShadow="md">
      <Text fontWeight="bold" fontSize="2xl" mb={4} color="white">
        Carrinho de Compras
      </Text>
      {cartItems.length === 0 ? (
        <Text color="white" textAlign="center">Nenhum item no carrinho.</Text>
      ) : (
        <VStack align="stretch" spacing={4}>
          {cartItems.map((item, idx) => (
            <Flex key={idx} justify="space-between" align="center" p={3} bg="whiteAlpha.200" borderRadius="md">
              <Box>
                <Text fontWeight="bold" color="white">{item.name}</Text>
                <Text color="gray.200" fontSize="sm">{item.description}</Text>
              </Box>
              <Text color="blue.300" fontWeight="bold">R$ {Number(item.price).toFixed(2)}</Text>
            </Flex>
          ))}
          <Flex justify="space-between" align="center" mt={2}>
            <Text fontWeight="bold" color="white">Total:</Text>
            <Text fontWeight="bold" color="white.300">R$ {total.toFixed(2)}</Text>
          </Flex>
        </VStack>
      )}

      {cartItems.length > 0 && (
        <Box as="form" onSubmit={handleAddressSubmit} mt={8}>
          <Text fontWeight="bold" mb={2} color="white">Endereço para Entrega</Text>
          <Input placeholder="CEP" name="zipCode" value={address.zipCode} onChange={handleChange} required mb={2} />
          <Input placeholder="Estado" name="state" value={address.state} onChange={handleChange} required mb={2} />
          <Input placeholder="Cidade" name="city" value={address.city} onChange={handleChange} required mb={2} />
          <Input placeholder="Rua" name="street" value={address.street} onChange={handleChange} required mb={2} />
          <Input placeholder="Bairro" name="district" value={address.district} onChange={handleChange} required mb={2} />
          <Input placeholder="Complemento" name="numberForget" value={address.numberForget} onChange={handleChange} mb={2} />
          <Button type="submit" colorScheme="green" mt={2} w="100%" isLoading={loading}>
            Finalizar Compra
          </Button>
        </Box>
      )}
    </Box>
  );
}