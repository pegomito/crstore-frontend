'use client';

import { Box, Flex, Image, Input, Button } from "@chakra-ui/react";
import { IoArrowBack } from "react-icons/io5";
import { useRouter } from "next/navigation";

export default function ProductLayout({ children }) {
    const router = useRouter();
  return (
    
    <Box
    minH="100vh"
    display="flex"
    flexDirection="column"
    style={{
      background: "rgba(16, 25, 43, 0.97)",
      backgroundImage: "url('https://static.vecteezy.com/ti/vetor-gratis/p1/10407633-fantastico-esportes-design-futurista-fundo-papel-de-parede-gratis-vetor.jpg')",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
    }}
  >
      <Box minH="100vh" bg="rgba(16, 25, 43, 0.97)">

          <Flex
              w="100%"
              style={{ background: "rgba(36, 53, 109, 0.97)" }}
              py={2}
              px={4}
              align="center"
              mb={8}
          >
              <Flex w="100%" justify="center" align="center" gap={6}>
                  <Button onClick={() => router.push("/lobby")} style={{ background: "rgba(53, 73, 138, 0.97)", color: "white" }}  >
                    
                        <IoArrowBack size={24} />
                        Voltar
                  </Button>
                  <Image
                      w="9%"
                      src="https://sdmntprsouthcentralus.oaiusercontent.com/files/00000000-a1d8-61f7-8811-8cdce9d52ee1/raw?se=2025-05-26T21%3A14%3A34Z&sp=r&sv=2024-08-04&sr=b&scid=c17396b5-f256-51cd-af5f-f412cd94af98&skoid=bbd22fc4-f881-4ea4-b2f3-c12033cf6a8b&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-05-26T07%3A52%3A53Z&ske=2025-05-27T07%3A52%3A53Z&sks=b&skv=2024-08-04&sig=x6W3HmSrXZtWdlIEVr1t9ntw0Klmqgp1s6%2BzqNTYkCM%3D"
                      alt="Logo"
                  />
              </Flex>
          </Flex>
      {/* Conteúdo principal */}
      <Box w="100%" maxW="900px" mx="auto" mt={4} p={8}>
        {children}
      </Box>
    </Box>
  </Box>
  );
}