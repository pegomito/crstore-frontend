'use client';
import { Input, Button, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { toaster } from "@/components/ui/toaster";
import axios from "@/utils/axios";

export default function RegisterInput({ onRegisterSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    cpf: "",
    username: "",
    phone: "",
    password: "",
    email: "",
    role: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    const { name, cpf, username, phone, password, email } = formData;

    if (!name || !cpf || !username || !phone || !password || !email) {
      toaster.create({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios!",
        type: "error",
      });
      return;
    }

    try {
      const response = await axios.post("/users", formData); 
      toaster.create({
        title: "Sucesso",
        description: "Usuário cadastrado com sucesso!",
        type: "success",
      });
      onRegisterSuccess(); 
    } catch (error) {
      let msg = "Erro ao cadastrar usuário. Tente novamente.";
      if (error?.response?.data) {
        if (typeof error.response.data === "string") {
          msg = error.response.data;
        } else if (typeof error.response.data.message === "string") {
          msg = error.response.data.message;
        }
      }
      toaster.create({
        title: "Erro",
        description: msg,
        type: "error",
      });
    }
  };

  return (  
    <Stack spacing={4}>
      <Input
        name="name"
        placeholder="Nome"
        onChange={handleChange}
        borderColor="white"
        _placeholder={{ color: "white" }}
      />
      <Input
        name="cpf"
        placeholder="CPF"
        onChange={handleChange}
        borderColor="white"
        _placeholder={{ color: "white" }}
      />
      <Input
        name="username"
        placeholder="Username"
        onChange={handleChange}
        borderColor="white"
        _placeholder={{ color: "white" }}
      />
      <Input
        name="phone"
        placeholder="Telefone"
        onChange={handleChange}
        borderColor="white"
        _placeholder={{ color: "white" }}
      />
      <Input
        name="email"
        placeholder="E-mail"
        onChange={handleChange}
        borderColor="white"
        _placeholder={{ color: "white" }}
      />
      <Input
        name="role"
        placeholder="Cargo (ex: admin, user)"
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
      <Button onClick={handleRegister} colorScheme="blue">
        Cadastrar
      </Button>
    </Stack>
  );
}