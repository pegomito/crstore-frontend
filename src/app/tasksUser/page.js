"use client";
import TabelaCrudAll from "@/components/TabelaCrudAll";
import InputCreate from "@/components/InputCreate";
import api from "@/utils/axios";
import { toaster } from "@/components/ui/toaster";
import { MdChevronRight, MdChevronLeft } from "react-icons/md";
import React, { useState, useEffect } from "react";
import InputPesquisa from "@/components/InputPesquisa";
import { MdMoreTime } from "react-icons/md";
import {
  Box,
  Flex,
  Heading,
  Grid,
  GridItem,
  Stack,
  Pagination,
  ButtonGroup,
  IconButton,
} from "@chakra-ui/react";

export default function TasksUsuario() {
  const [tasks, setTasks] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState({ open: false });
  const [loadingSave, setLoadingSave] = useState(false);

  const filteredTasks = tasks.filter((task) =>
    task.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexUltimoItem = currentPage * itemsPerPage;
  const indexPrimeiroItem = indexUltimoItem - itemsPerPage;
  const tasksAtuais = filteredTasks.slice(indexPrimeiroItem, indexUltimoItem);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const buscarUsuario = async () => {
    try {
      const response = await api.get("/users");
      setTasks(response.data.data || []);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error.message);
    }
  };

  useEffect(() => {
    buscarUsuario();
  }, []);

  const criarUsuario = async (formValues) => {
    if (
      !formValues.name ||
      !formValues.cpf ||
      !formValues.username ||
      !formValues.phone ||
      !formValues.passwordHash ||
      !formValues.role ||
      !formValues.email
    ) {
      alert("Todos os campos obrigatórios devem ser preenchidos.");
      return;
    }

    try {
      const response = await api.post("/users", {
        name: formValues.name,
        cpf: formValues.cpf,
        username: formValues.username,
        phone: formValues.phone,
        passwordHash: formValues.passwordHash,
        role: formValues.role,
        email: formValues.email,
        cart: formValues.cart || null,
        token: formValues.token || null,
        recuperation: formValues.recuperation || null,
        passwordResetExpires: formValues.passwordResetExpires || null,
      });

      toaster.create({
        title: "Usuário criado com sucesso",
        description: `Usuário ${formValues.name} foi criado.`,
        type: "success",
      });

      await buscarUsuario();
      setOpenDialog({ open: false });
    } catch (error) {
      console.error("Erro ao criar usuário:", error.response?.data || error.message);
      toaster.create({
        title: "Erro ao criar usuário",
        description: `Erro = ${error.response?.data?.message || error.message}`,
        type: "error",
      });
    }
  };

  const editarUsuario = async (task) => {
    if (!task.name || !task.name.trim()) {
      alert("O campo de nome está vazio.");
      return;
    }

    try {
      await api.patch(`/users/${task.id}`, {
        name: task.name,
        cpf: task.cpf,
        username: task.username,
        phone: task.phone,
        passwordHash: task.passwordHash,
        role: task.role,
        email: task.email,
        cart: task.cart,
        token: task.token,
        recuperation: task.recuperation,
        passwordResetExpires: task.passwordResetExpires,
      });

      const usuariosAtualizados = tasks.map((t) =>
        t.id === task.id ? { ...t, ...task } : t
      );
      setTasks(usuariosAtualizados);

      toaster.create({
        title: "Usuário atualizado com sucesso!",
        description: `Usuário foi atualizado para ${task.name}`,
        type: "success",
      });
    } catch (error) {
      toaster.create({
        title: "Erro ao atualizar usuário",
        description: `Erro = ${error.message}`,
        type: "error",
      });
    }
  };

  const excluirUsuario = async (id) => {
    try {
      await api.delete(`/users/${id}`);

      const tasksAtualizado = tasks.filter((task) => task.id !== id);
      setTasks(tasksAtualizado);

      toaster.create({
        title: "Usuário excluído com sucesso",
        description: `Usuário com ID ${id} foi removido.`,
        type: "success",
      });
    } catch (error) {
      toaster.create({
        title: "Erro ao excluir usuário",
        description: `Erro = ${error.message}`,
        type: "error",
      });
    }
  };

  return (
    <Box p={8} borderRadius="md" boxShadow="lg">
      <Flex justifyContent="center">
        <Heading mb={12} gapX={2} display="flex">
          CRUD Usuários <MdMoreTime />
        </Heading>
      </Flex>
      <Flex justifyContent="center">
        <Grid templateRows="repeat(2, 1fr)" templateColumns="repeat(2, 1fr)" gap={4}>
          <GridItem rowSpan={3}>
            <InputPesquisa searchTerm={searchTerm} SetSeachTerm={setSearchTerm} />
          </GridItem>
          <GridItem rowSpan={1}>
            <InputCreate
              fields={[
                { name: "name", placeholder: "Ex: João Silva", title: "Nome:" },
                { name: "cpf", placeholder: "Ex: 123.456.789-00", title: "CPF:" },
                { name: "username", placeholder: "Ex: joaosilva", title: "Username:" },
                { name: "phone", placeholder: "Ex: (11) 98765-4321", title: "Telefone:" },
                { name: "passwordHash", placeholder: "Digite uma senha", title: "Senha:" },
                { name: "role", placeholder: "Ex: admin", title: "Função:" },
                { name: "email", placeholder: "Ex: joao@email.com", title: "Email:" },
                { name: "cart", placeholder: "JSON do carrinho", title: "Carrinho:" },
                { name: "token", placeholder: "Token de autenticação", title: "Token:" },
                { name: "recuperation", placeholder: "Código de recuperação", title: "Recuperação:" },
                { name: "passwordResetExpires", placeholder: "Data de expiração", title: "Expiração da Senha:" },
              ]}
              submit={(formValues) => criarUsuario(formValues)}
              loadingSave={loadingSave}
              open={openDialog}
              setOpen={setOpenDialog}
            />
          </GridItem>
        </Grid>
      </Flex>
      <Stack style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <TabelaCrudAll
          items={tasksAtuais}
          headers={[
            { key: "id", label: "ID" },
            { key: "name", label: "Nome" },
            { key: "cpf", label: "CPF" },
            { key: "username", label: "Username" },
            { key: "phone", label: "Telefone" },
            { key: "email", label: "Email" },
            { key: "role", label: "Função" },
            { key: "cart", label: "Carrinho" },
            { key: "token", label: "Token" },
            { key: "recuperation", label: "Recuperação" },
            { key: "passwordResetExpires", label: "Expiração da Senha" },
          ]}
          onEdit={editarUsuario}
          onDelete={excluirUsuario}
          acoes={true}
        />
        <Pagination.Root
          count={filteredTasks.length}
          pageSize={itemsPerPage}
          defaultPage={1}
          page={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
        >
          <ButtonGroup variant="ghost" size="sm">
            <Pagination.PrevTrigger asChild>
              <IconButton onClick={() => setCurrentPage(currentPage - 1)}>
                <MdChevronLeft />
              </IconButton>
            </Pagination.PrevTrigger>
            <Pagination.Items
              render={(page) => (
                <IconButton
                  key={page.value}
                  onClick={() => setCurrentPage(page.value)}
                  variant={{ base: "ghost", _selected: "outline" }}
                >
                  {page.value}
                </IconButton>
              )}
            />
            <Pagination.NextTrigger asChild>
              <IconButton onClick={() => setCurrentPage(currentPage + 1)}>
                <MdChevronRight />
              </IconButton>
            </Pagination.NextTrigger>
          </ButtonGroup>
        </Pagination.Root>
      </Stack>
    </Box>
  );
}