import React, { useState, useEffect } from "react";
import { Box, Text, Button, VStack, Flex } from "@chakra-ui/react";
import api from "@/utils/axios";

export default function ClosePurchase({ carrinho, desconto, cupomObj, limparCarrinho, onSuccess, onCancel }) {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
  const [enderecos, setEnderecos] = useState([]);
  const [pagamentos, setPagamentos] = useState([]);
  const [enderecoSelecionado, setEnderecoSelecionado] = useState("");
  const [pagamentoSelecionado, setPagamentoSelecionado] = useState("");
  const [dadosCarregados, setDadosCarregados] = useState(false);

  const getAuthHeader = () => {
    const token = localStorage.getItem("authToken");
    return { Authorization: `Bearer ${token}` };
  };

  useEffect(() => {
    Promise.all([
      api.get("/adresses", { headers: getAuthHeader() }).catch(() => ({ data: { data: [] } })),
      api.get("/payments", { headers: getAuthHeader() }).catch(() => ({ data: { data: [] } }))
    ]).then(([enderecosRes, pagamentosRes]) => {
      setEnderecos(enderecosRes.data.data || []);
      setPagamentos(pagamentosRes.data.data || []);
      setDadosCarregados(true);
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
        idAdress: Number(enderecoSelecionado),
        idPayment: Number(pagamentoSelecionado),
      }, { headers: getAuthHeader() });
      limparCarrinho();
      if (onSuccess) onSuccess();
      alert("Pedido finalizado com sucesso!");
    } catch (err) {
      alert(err?.response?.data?.message || err.message || "Erro ao finalizar pedido");
    }
  };

  if (!dadosCarregados) {
    return (
      <Flex justify="flex-end" w="100%">
        <Box w="100%" maxW="lg" p={6} mr={8}>
          <VStack spacing={6} align="stretch">
            <Text fontWeight="bold" color="white" fontSize="lg">Carregando...</Text>
          </VStack>
        </Box>
      </Flex>
    );
  }

  return (
    <Flex justify="flex-end" w="100%">
      <Box w="100%" maxW="lg" p={6} mr={8}>
        <VStack spacing={6} align="stretch">
          <Text fontWeight="bold" color="white" fontSize="lg">Resumo do Pedido</Text>
          <Box bg="whiteAlpha.100" borderRadius="md" p={4}>
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
            <Flex justify="space-between" mt={3}>
              <Text color="white">Subtotal:</Text>
              <Text color="white">R$ {(carrinho.subtotal ?? 0).toFixed(2)}</Text>
            </Flex>
            {desconto > 0 && (
              <Flex justify="space-between" mt={2}>
                <Text color="white">Desconto:</Text>
                <Text color="green.300">- R$ {desconto.toFixed(2)}</Text>
              </Flex>
            )}
            <Flex justify="space-between" mt={2}>
              <Text color="white" fontWeight="bold">Total:</Text>
              <Text color="white.300" fontWeight="bold">
                R$ {((carrinho.total ?? 0) - desconto).toFixed(2)}
              </Text>
            </Flex>
          </Box>

          <Text color="white" mt={2}>Selecione o endereço:</Text>
          <Box as="select" 
            value={enderecoSelecionado}
            onChange={(e) => setEnderecoSelecionado(e.target.value)}
            p={3}
            borderRadius="md"
            bg="white"
            color="black"
            border="1px solid"
            borderColor="gray.300"
            w="100%"
          >
            <option value="">Selecione um endereço</option>
            {enderecos.map(e => (
              <option key={e.id} value={e.id}>
                {e.street}, {e.numberForget} - {e.district}, {e.city}/{e.state}
              </option>
            ))}
          </Box>

          <Text color="white" mt={2}>Selecione o pagamento:</Text>
          <Box as="select"
            value={pagamentoSelecionado}
            onChange={(e) => setPagamentoSelecionado(e.target.value)}
            p={3}
            borderRadius="md"
            bg="white"
            color="black"
            border="1px solid"
            borderColor="gray.300"
            w="100%"
          >
            <option value="">Selecione o pagamento</option>
            {pagamentos.map(p => (
              <option key={p.id} value={p.id}>
                {p.tipo || p.name}
              </option>
            ))}
          </Box>

          <Flex gap={4} mt={4}>
            <Button colorScheme="green" flex="1" onClick={finalizar} p={4}>
              Confirmar Compra
            </Button>
            <Button colorScheme="red" flex="1" variant="outline" onClick={onCancel} p={4}>
              Cancelar
            </Button>
          </Flex>
        </VStack>
      </Box>
    </Flex>
  );
}