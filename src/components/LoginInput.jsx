'use client';
import { Input, Button, Stack } from "@chakra-ui/react";
import { useState } from "react";
import { toaster } from "@/components/ui/toaster";
import axios from "@/utils/axios";

export default function LoginInput({ onLoginSuccess }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    const { email, password } = formData;

    if (!email || !password) {
      toaster.create({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios!",
        type: "error",
      });
      return;
    }

    try {
      const response = await axios.post("/users/login", formData); // Rota correta para login
      toaster.create({
        title: "Sucesso",
        description: "Login realizado com sucesso!",
        type: "success",
      });
      onLoginSuccess(response.data.response); // Passa o token JWT para o pai
    } catch (error) {
      toaster.create({
        title: "Erro",
        description: error.response?.data || "Erro ao realizar login.",
        type: "error",
      });
    }
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