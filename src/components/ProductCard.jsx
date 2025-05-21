import { Card, Image, Text } from "@chakra-ui/react";
import api from "../utils/axios";

export default function ProductCard({ prod }) {
  if (!prod) return null;
  return (
    <Card.Root maxW="px"  w="260px" h="380px" bg="gray.800" color="white" boxShadow="lg">
      <Card.Header>
        <Text fontWeight="bold" fontSize="lg">{prod.name}</Text>
      </Card.Header>
      <Card.Body>
        <Text fontSize="md" mb={2}>{prod.description}</Text>
        {prod.image && prod.image !== "" && (
          <Image
            src={prod.image.startsWith("/") ? `${api.defaults.baseURL}${prod.image}` : prod.image}
            alt={prod.name}
            boxSize="150px"
            objectFit="cover"
            borderRadius="md"
            mx="auto"
            mb={2}
          />
        )}
      </Card.Body>
      <Card.Footer>
        <Text fontWeight="bold" color="blue.300" fontSize="xl">
          R$ {Number(prod.price).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </Text>
      </Card.Footer>
    </Card.Root>
  );
}