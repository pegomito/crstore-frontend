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
      backgroundImage: "url('https://img.freepik.com/vetores-gratis/fundo-de-futebol-gradiente-dinamico_23-2149007789.jpg?semt=ais_hybrid&w=740')",
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
                      src="/images/logo2.png"
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