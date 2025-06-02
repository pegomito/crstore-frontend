import React, { useState, useEffect } from "react";
import { Box, Text, Button, VStack, Flex, Select } from "@chakra-ui/react";
import api from "@/utils/axios";

export default function ClosePurchase({ carrinho, desconto, cupomObj, limparCarrinho, onSuccess, onCancel }) {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
  const [enderecos, setEnderecos] = useState([]);
  const [pagamentos, setPagamentos] = useState([]);
  const [enderecoSelecionado, setEnderecoSelecionado] = useState("");
  const [pagamentoSelecionado, setPagamentoSelecionado] = useState("");

  // Função para pegar o token igual ao Adress.jsx
  const getAuthHeader = () => {
    const token = localStorage.getItem("authToken");
    return { Authorization: `Bearer ${token}` };
  };

  useEffect(() => {
  console.log("Usuário:", usuario);
  console.log("Token:", getAuthHeader());
  api.get("/adresses", { headers: getAuthHeader() })
    .then(res => {
      console.log("Endereços recebidos:", res.data.data);
      setEnderecos(res.data.data);
    })
    .catch(err => {
      console.error("Erro ao buscar endereços:", err);
      setEnderecos([]);
    });
}, [usuario]);

  const finalizar = async () => {
    if (!usuario?.id || !enderecoSelecionado || !pagamentoSelecionado) {
      alert("Selecione endereço e pagamento.");
      return;
    }
    try {
      await api.post("/orders", {
        itens: carrinho.itens,
        total: carrinho.total,
        totalDiscount: desconto,
        idCoupon: cupomObj?.id || null,
        status: "Pendente",
        idUserCostumer: usuario.id,
        idUserDelivery: null,
        idAdress: enderecoSelecionado,
        idPayment: pagamentoSelecionado,
      }, { headers: getAuthHeader() });
      limparCarrinho();
      if (onSuccess) onSuccess();
      alert("Pedido finalizado com sucesso!");
    } catch (err) {
      alert(err?.response?.data?.message || err.message || "Erro ao finalizar pedido");
    }
  };

  return (
    <Box>
      <VStack spacing={4} align="stretch">
        <Text fontWeight="bold" color="white" fontSize="lg">Resumo do Pedido</Text>
        <Box bg="whiteAlpha.100" borderRadius="md" p={3}>
          {carrinho.itens.map((item, idx) => (
            <Flex key={idx} justify="space-between" align="center" mb={2}>
              <Box>
                <Text color="white" fontWeight="bold">{item.nome}</Text>
                <Text color="gray.300" fontSize="sm">Qtd: {item.quantidade}</Text>
              </Box>
              <Text color="blue.200" fontWeight="bold">
                R$ {(item.preco * item.quantidade).toFixed(2)}
              </Text>
            </Flex>
          ))}
          <Flex justify="space-between" mt={2}>
            <Text color="white">Subtotal:</Text>
            <Text color="white">R$ {(carrinho.subtotal ?? 0).toFixed(2)}</Text>
          </Flex>
          {desconto > 0 && (
            <Flex justify="space-between">
              <Text color="white">Desconto:</Text>
              <Text color="green.300">- R$ {desconto.toFixed(2)}</Text>
            </Flex>
          )}
          <Flex justify="space-between" mt={1}>
            <Text color="white" fontWeight="bold">Total:</Text>
            <Text color="white.300" fontWeight="bold">
              R$ {((carrinho.total ?? 0) - desconto).toFixed(2)}
            </Text>
          </Flex>
        </Box>
        <Text color="white" mt={2}>Selecione o endereço:</Text>
        <Select.Root
          placeholder="Selecione o endereço"
          value={enderecoSelecionado}
          onChange={e => setEnderecoSelecionado(e.target.value)}
        >
          {enderecos.map(e => (
            <option key={e.id} value={e.id}>
              {e.street}, {e.numberForget} - {e.district}, {e.city}/{e.state}
            </option>
          ))}
        </Select.Root>
        <Text color="white">Selecione o pagamento:</Text>
        <Select.Root
          placeholder="Selecione o pagamento"
          value={pagamentoSelecionado}
          onChange={e => setPagamentoSelecionado(e.target.value)}
        >
          {pagamentos.map(p => (
            <option key={p.id} value={p.id}>{p.tipo}</option>
          ))}
        </Select.Root>
        <Flex gap={2} mt={2}>
          <Button colorScheme="green" flex="1" onClick={finalizar}>
            Confirmar Compra
          </Button>
          <Button colorScheme="red" flex="1" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        </Flex>
      </VStack>
    </Box>
  );
}