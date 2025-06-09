import React, { useState } from "react";
import { Box, Text, VStack, Flex, Button, Input, Dialog } from "@chakra-ui/react";
import { useCarrinho } from "@/context/CarrinhoContext";
import api from "@/utils/axios";
import ClosePurchase from "./ClosePurchase";

export default function Cart() {
  const { carrinho, limparCarrinho, removerItem } = useCarrinho();
  const [cupom, setCupom] = useState("");
  const [desconto, setDesconto] = useState(0);
  const [cupomMsg, setCupomMsg] = useState("");
  const [cupomObj, setCupomObj] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Pegando dados do localStorage
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
  const enderecoSelecionado = JSON.parse(localStorage.getItem("enderecoSelecionado") || "null");
  const pagamentoSelecionado = JSON.parse(localStorage.getItem("pagamentoSelecionado") || "null");

  const aplicarCupom = async () => {
    try {
      const res = await api.get(`/coupons?code=${cupom}`);
      const dataArr = res.data.data;
      const data = Array.isArray(dataArr) && dataArr.length > 0 ? dataArr[0] : null;

      if (!data || !data.type || !data.value) {
        setCupomMsg("Cupom não encontrado.");
        setDesconto(0);
        setCupomObj(null);
        return;
      }

      if (data.uses !== null && Number(data.uses) <= 0) {
        setCupomMsg("Cupom esgotado.");
        setDesconto(0);
        setCupomObj(null);
        return;
      }

      setCupomObj(data);

      if (data.type === "percent") {
        setDesconto((carrinho.subtotal * Number(data.value)) / 100);
        setCupomMsg(`Cupom aplicado: -${data.value}%`);
      } else if (data.type === "fixed") {
        setDesconto(Number(data.value));
        setCupomMsg(`Cupom aplicado: -R$ ${Number(data.value).toFixed(2)}`);
      } else {
        setCupomMsg("Tipo de cupom inválido.");
        setDesconto(0);
        setCupomObj(null);
      }
    } catch {
      setCupomMsg("Erro ao validar cupom.");
      setDesconto(0);
      setCupomObj(null);
    }
  };

  const fimCompra = async () => {
    try {
      await api.post("/orders", {
        itens: carrinho.itens,
        total: carrinho.total,
        totalDiscount: desconto,
        idCoupon: cupomObj?.id || null,
        status: "Pendente",
        idUserCostumer: usuario?.id,
        idUserDelivery: null,
        idAdress: enderecoSelecionado?.id,
        idPayment: pagamentoSelecionado?.id,
      });

      limparCarrinho();
      setDesconto(0);
      setCupom("");
      setCupomMsg("");
      setCupomObj(null);
      setDialogOpen(false);
    } catch (err) {
      alert(err?.response?.data?.message || err.message || "Erro ao finalizar pedido");
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
            <Input
              value={cupom}
              onChange={e => setCupom(e.target.value)}
              placeholder="Digite o cupom"
              size="sm"
              w="120px"
              bg="whiteAlpha.200"
              color="white"
            />
            <Button size="sm" colorScheme="blue" ml={2} onClick={aplicarCupom}>
              Aplicar
            </Button>
          </Flex>
          {cupomMsg && (
            <Text color="white.300" fontSize="sm">{cupomMsg}</Text>
          )}
          {desconto > 0 && (
            <Flex justify="space-between" align="center">
              <Text fontWeight="bold" color="white">Desconto:</Text>
              <Text fontWeight="bold" color="green.300">- R$ {desconto.toFixed(2)}</Text>
            </Flex>
          )}
          <Flex justify="space-between" align="center">
            <Text fontWeight="bold" color="white">Total:</Text>
            <Text fontWeight="bold" color="white.300">
              R$ {((carrinho.total ?? 0) - desconto).toFixed(2)}
            </Text>
          </Flex>

            <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
              <Dialog.Trigger asChild>
                <Button colorScheme="green" w="100%" mt={4}>
                  Finalizar Compra
                </Button>
              </Dialog.Trigger>
              <Dialog.Backdrop />
              <Dialog.Positioner>
                <Dialog.Content bg="gray.800">
                  <Dialog.CloseTrigger asChild>
                    <Button
                      position="absolute"
                      top={2}
                      right={2}
                      left="55%"
                      colorScheme="red"
                      size="sm"
                      variant="ghost"
                      onClick={() => setDialogOpen(false)}
                    >
                      X
                    </Button>
                  </Dialog.CloseTrigger>
                  <Dialog.Header>
                    <Dialog.Title color="white">Confirmar Pedido</Dialog.Title>
                  </Dialog.Header>
                  <Dialog.Body>
                    <ClosePurchase
                      carrinho={carrinho}
                      desconto={desconto}
                      cupomObj={cupomObj}
                      limparCarrinho={limparCarrinho}
                      onSuccess={fimCompra}
                      onCancel={() => setDialogOpen(false)} 
                    />
                  </Dialog.Body>
                  <Dialog.Footer />
                </Dialog.Content>
              </Dialog.Positioner>
            </Dialog.Root>
        </VStack>
      )}
    </Box>
  );
}