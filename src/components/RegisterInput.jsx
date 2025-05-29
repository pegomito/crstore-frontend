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

  const mudarInfo = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const cadastrarInfo = async () => {
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
        onChange={mudarInfo}
        borderColor="white"
        _placeholder={{ color: "white" }}
      />
      <Input
        name="cpf"
        placeholder="CPF"
        onChange={mudarInfo}
        borderColor="white"
        _placeholder={{ color: "white" }}
      />
      <Input
        name="username"
        placeholder="Username"
        onChange={mudarInfo}
        borderColor="white"
        _placeholder={{ color: "white" }}
      />
      <Input
        name="phone"
        placeholder="Telefone"
        onChange={mudarInfo}
        borderColor="white"
        _placeholder={{ color: "white" }}
      />
      <Input
        name="email"
        placeholder="E-mail"
        onChange={mudarInfo}
        borderColor="white"
        _placeholder={{ color: "white" }}
      />
      <Input
        name="role"
        placeholder="Cargo (ex: admin, user)"
        onChange={mudarInfo}
        borderColor="white"
        _placeholder={{ color: "white" }}
      />
      <Input
        name="password"
        type="password"
        placeholder="Senha"
        onChange={mudarInfo}
        borderColor="white"
        _placeholder={{ color: "white" }}
      />
      <Button onClick={cadastrarInfo} colorScheme="blue">
        Cadastrar
      </Button>
    </Stack>
  );
}