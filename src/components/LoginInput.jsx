'use client';
import { useState } from "react";
import { Input, Button, Stack } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";

export default function LoginInput({ onLogin }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = () => {
    const { email, password } = formData;
    if (!email || !password) {
      toaster.create({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios!",
        type: "error",
      });
      return;
    }
    onLogin(formData); // Chama a função passada pelo LoginRouter
  };

  return (
    <Stack spacing={4}>
      <Input
        name="email"
        placeholder="E-mail"
        onChange={handleChange}
        borderColor="white"
        _placeholder={{ color: "white" }}
      />
      <Input
        name="password"
        type="password"
        placeholder="Senha"
        onChange={handleChange}
        borderColor="white"
        _placeholder={{ color: "white" }}
      />
      <Button onClick={handleLogin} colorScheme="blue">
        Entrar
      </Button>
    </Stack>
  );
}