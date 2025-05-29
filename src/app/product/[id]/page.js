'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Box, Text, Image, Spinner, Center, Button, Flex, VStack, Select, Portal, createListCollection   } from "@chakra-ui/react";
import api from "@/utils/axios";
import { Toaster, toaster } from "@/components/ui/toaster"
import { useCarrinho } from "@/context/CarrinhoContext";



export default function ProductDetailPage() {
  const { id } = useParams();
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);
  const { adicionarProduto } = useCarrinho();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.get(`/products/${id}`)
      .then(res => {
        setProduto(res.data.data || res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <Center py={10}><Spinner size="xl" /></Center>;
  }

  if (!produto) {
    return <Center py={10}><Text>Produto não encontrado.</Text></Center>;
  }

  const frameworks = createListCollection({
  items: [
    { label: "G", value: "react" },
    { label: "M", value: "vue" },
    { label: "P", value: "angular" },
    { label: "GG", value: "svelte" },
  ],
})

  return (
    <Box w="100%" maxW="none" ml={0} mr="auto" p={8} borderRadius="lg">
      <Flex direction={["column", "row"]} alignItems="flex-start" gap={10}>
        {produto.image && (
          <Box flex="1" display="flex" justifyContent="left" alignItems="center">
            <Image
              src={produto.image.startsWith("/") ? `${api.defaults.baseURL}${produto.image}` : produto.image}
              alt={produto.name}
              w="500px"
              h="700px"
              maxW="100vw"
              maxH="80vh"
              objectFit="contain"
              borderRadius="lg"
              boxShadow="md"
              bg="white"
              p={4}
            />
          </Box>
        )}
        <VStack
          flex="2"
          alignItems="flex-start"
          justifyContent="center"
          spacing={6}
          w="100%"
          p={4}
          bg="whiteAlpha.200"
          borderRadius="lg"
          boxShadow="md"
        >
          <Text fontWeight="bold" fontSize="2xl" color="white">
            {produto.name}
          </Text>
          <Text fontSize="md" color="gray.200">
            {produto.description}
          </Text>
          <Text fontWeight="bold" color="yellow.300" fontSize="xl">
            R$ {Number(produto.price).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </Text>
          <Select.Root>
          <Select.HiddenSelect />
      <Select.Label>Selecione seu Tamanho</Select.Label>
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder="Tamanho" />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content>
            {frameworks.items.map((framework) => (
              <Select.Item item={framework} key={framework.value}>
                {framework.label}
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
         <Button
  colorScheme="yellow"
  size="md"
  fontWeight="bold"
  px={8}
  onClick={() => {
    adicionarProduto(produto, 1);
    toaster.create({
      title: "Produto adicionado ao carrinho",
      description: `${produto.name} foi adicionado ao seu carrinho.`,
    });
  }}
>
  Adicionar ao Carrinho
</Button>

          <Button
            variant="outline"
            size="md"
            fontWeight="bold"
            px={8}
            onClick={() => {
              window.history.back();
            }}
          >
            Continuar Comprando
          </Button>
        </VStack>
      </Flex>
    </Box>
  );
}