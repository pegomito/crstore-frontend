'use client';
import { Box, VStack, Heading, Text, Button, Image } from "@chakra-ui/react";
import React, { useState } from "react";
import LoginInput from "@/components/LoginInput";
import LoginRouter from "@/components/LoginRouter";
import RegisterInput from "@/components/RegisterInput";
import { Toaster } from "@/components/ui/toaster";

export default function LoginPc() {
  const [isRegistering, setIsRegistering] = useState(false);

  const registerForm = () => {
    setIsRegistering(!isRegistering);
  };

  return (
    <Box
      w="100%"
      h="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      filter="contrast(95%)"
      bgGradient="to-r"
      gradientFrom="blue.700"
      gradientTo="black"
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
    >
      <Box w="50%" display="flex" justifyContent="center" alignItems="center">
        <Image
          w="55%"
          src="https://www.pngplay.com/wp-content/uploads/13/Jordan-Logo-PNG-Clipart-Background.png"
          alt="Loading..."
        />
      </Box>

      <Box w="50%" display="flex" justifyContent="center" alignItems="center">
        <VStack align="left">
          <Heading color="white" fontSize={40} fontWeight={800} textAlign="center">
            Bem-Vindo à
          </Heading>
          <Text color="white" fontSize={40} fontWeight={800} textAlign="center">
            Loja dos Guri!
          </Text>
          <Text fontSize="lg" color="white" opacity={0.8}>
            Acesse sua conta e começe a comprar!
          </Text>

          {isRegistering ? (
            <>
              <RegisterInput onRegisterSuccess={registerForm} />
              <Button
                mt={2}
                colorScheme="gray"
                variant="solid"
                onClick={registerForm}
              >
                Voltar ao Login
              </Button>
            </>
          ) : (
            <LoginRouter>
              {({ loginUsuario }) => (
                <LoginInput onLogin={loginUsuario} />
              )}
            </LoginRouter>
          )}
          <Button
            mt={4}
            onClick={registerForm}
            colorScheme="teal"
            variant="link"
          >
            {isRegistering
              ? "Já tem uma conta? Faça login"
              : "Não tem uma conta? Cadastre-se"}
          </Button>
        </VStack>
      </Box>
      <Toaster />
    </Box>
  );
}