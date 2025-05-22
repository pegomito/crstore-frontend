'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Box, Text, Image, Spinner, Center, Button } from "@chakra-ui/react";
import api from "@/utils/axios";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.get(`/products/${id}`)
      .then(res => {
  console.log("API retorno:", res.data);
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

  return (
    <Box >
      {produto.image && (
        <Image
          src={produto.image.startsWith("/") ? `${api.defaults.baseURL}${produto.image}` : produto.image}
          alt={produto.name}
          maxWidth={"50%"}
          justifyContent={"center"}
        />
      )}
      <Text fontWeight="bold" fontSize="2xl" mb={2}>{produto.name}</Text>
      <Text fontSize="lg" mb={4}>{produto.description}</Text>
      <Text fontWeight="bold" color="blue.500" fontSize="xl" mb={4}>
        R$ {Number(produto.price).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
      </Text>
      <Button colorScheme="blue" w="100%">Adicionar ao carrinho</Button>
    </Box>
  );
}