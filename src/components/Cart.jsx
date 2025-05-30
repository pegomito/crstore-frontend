import React, { useState } from "react";
import { Box, Text, VStack, Flex, Button, Input } from "@chakra-ui/react";
import { useCarrinho } from "@/context/CarrinhoContext";

export default function Cart() {
  const { carrinho, limparCarrinho, removerItem } = useCarrinho();


  const fimCompra = () => {
    try {
      const resumo = carrinho.finalizaCompra();
      alert(
        `Compra finalizada!\nSubtotal: R$ ${(resumo.subtotal ?? 0).toFixed(2)}\nFrete: R$ ${(resumo.frete ?? 0).toFixed(2)}\nTotal: R$ ${(resumo.total ?? 0).toFixed(2)}`
      );
      limparCarrinho();
      setFrete(0);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Box w="100%" maxW="500px" mx="auto" mt={8} p={6} bg="whiteAlpha.100" borderRadius="lg" boxShadow="md">
      <Text fontWeight="bold" fontSize="2xl" mb={4} color="white">
        Carrinho de Compras
      </Text>
      {carrinho.itens.length === 0 ? (
        <Text color="white" textAlign="center">Nenhum item no carrinho.</Text>
      ) : (
        <VStack align="stretch" spacing={4}>
          {carrinho.itens.map((item, idx) => (
            <Flex key={idx} justify="space-between" align="center" p={3} bg="whiteAlpha.200" borderRadius="md">
              <Box>
                <Text fontWeight="bold" color="white">{item.nome}</Text>
                <Text color="gray.200" fontSize="sm">Qtd: {item.quantidade}</Text>
              </Box>
              <Text color="blue.300" fontWeight="bold">
                R$ {(item.preco * item.quantidade).toFixed(2)}
              </Text>
              <Button colorScheme="red" size="sm" ml={2} onClick={() => removerItem(idx)}>
                Remover
              </Button>
            </Flex>
          ))}
          <Flex justify="space-between" align="center" mt={2}>
            <Text fontWeight="bold" color="white">Subtotal:</Text>
            <Text fontWeight="bold" color="white.300">R$ {(carrinho.subtotal ?? 0).toFixed(2)}</Text>
          </Flex>
          <Flex justify="space-between" align="center">
            <Text fontWeight="bold" color="white">Cupom:</Text>
            
          </Flex>
          <Flex justify="space-between" align="center">
            <Text fontWeight="bold" color="white">Total:</Text>
            <Text fontWeight="bold" color="white.300">R$ {(carrinho.total ?? 0).toFixed(2)}</Text>
          </Flex>
          <Button colorScheme="green" onClick={fimCompra}>
            Finalizar Compra
          </Button>
        </VStack>
      )}
    </Box>
  );
}