import { Card, Image, Text, Button } from "@chakra-ui/react";
import api from "../utils/axios";
import Link from "next/link";

export default function ProductCard({ prod }) {
  if (!prod) return null;
  return (
    <Card.Root maxW="sm" overflow="hidden" style={{ background: "rgba(15, 37, 65, 0.97)" }}>
      {prod.image && prod.image !== "" && (
          <Image
            src={prod.image.startsWith("/") ? `${api.defaults.baseURL}${prod.image}` : prod.image}
            alt={prod.name}
            boxSize="300px"
            objectFit="cover"
            borderRadius="md"
            mx="auto"
            
          />
        )}
      <Card.Body gap="2" >
        <Card.Title>  <Text fontWeight="bold" fontSize="lg">{prod.name}</Text></Card.Title>
        <Card.Description>
          
        </Card.Description>
       <Text fontWeight="bold" color="blue.300" fontSize="xl">
          R$ {Number(prod.price).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </Text>
      </Card.Body>
      <Card.Footer gap="2">
        <Link href={`/product/${prod.id}`}>
          <Button variant="solid" w="100%">Ver de perto</Button>
        </Link>
        <Button variant="ghost">Adicionar ao carrinho</Button>
      </Card.Footer>
    </Card.Root>
  );
}

