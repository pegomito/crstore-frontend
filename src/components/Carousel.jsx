'use client';
import { useState, useEffect } from "react";
import {
  Dialog,
  Box,
  Button,
  VStack,
  Text,
  Input,
} from "@chakra-ui/react";

export default function Cart({ open, onOpenChange }) {
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
    if (open) {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartItems(cart);
    }
  }, [open]);

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/adresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(address),
      });
      if (!res.ok) throw new Error("Erro ao cadastrar endereço");
      alert("Endereço cadastrado com sucesso!");
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
      onOpenChange(false);
    } catch (err) {
      alert("Erro ao cadastrar endereço");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.CloseTrigger asChild>
            <Button position="absolute" top={2} right={2} size="sm">
              Fechar
            </Button>
          </Dialog.CloseTrigger>
          <Dialog.Header>
            <Dialog.Title>
              <Text fontWeight="bold" fontSize="xl">Carrinho</Text>
            </Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <VStack align="stretch" spacing={4}>
              <Text fontWeight="bold">Itens do Carrinho:</Text>
              {cartItems.length === 0 ? (
                <Text>Nenhum item no carrinho.</Text>
              ) : (
                cartItems.map((item, idx) => (
                  <Box key={idx} p={2} borderWidth={1} borderRadius="md">
                    <Text>{item.name} - R$ {item.price}</Text>
                  </Box>
                ))
              )}
              {cartItems.length > 0 && (
                <Box as="form" onSubmit={handleAddressSubmit} mt={4}>
                  <Text fontWeight="bold" mb={2}>Cadastrar Endereço para Entrega</Text>
                  <Input
                    placeholder="CEP"
                    name="zipCode"
                    value={address.zipCode}
                    onChange={handleChange}
                    required
                    mb={2}
                  />
                  <Input
                    placeholder="Estado"
                    name="state"
                    value={address.state}
                    onChange={handleChange}
                    required
                    mb={2}
                  />
                  <Input
                    placeholder="Cidade"
                    name="city"
                    value={address.city}
                    onChange={handleChange}
                    required
                    mb={2}
                  />
                  <Input
                    placeholder="Rua"
                    name="street"
                    value={address.street}
                    onChange={handleChange}
                    required
                    mb={2}
                  />
                  <Input
                    placeholder="Bairro"
                    name="district"
                    value={address.district}
                    onChange={handleChange}
                    required
                    mb={2}
                  />
                  <Input
                    placeholder="Complemento"
                    name="numberForget"
                    value={address.numberForget}
                    onChange={handleChange}
                    mb={2}
                  />
                  <Button
                    type="submit"
                    colorScheme="green"
                    mt={2}
                    w="100%"
                    isLoading={loading}
                  >
                    Finalizar Compra
                  </Button>
                </Box>
              )}
            </VStack>
          </Dialog.Body>
          <Dialog.Footer />
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}