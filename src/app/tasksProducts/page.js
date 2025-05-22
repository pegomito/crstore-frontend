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
  Button,
  Flex,
  Heading,
  Stack,
  Pagination,
  ButtonGroup,
  IconButton,
  GridItem,
  Grid,
} from "@chakra-ui/react";

export default function TasksProducts() {
  const [tasks, setTasks] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState({ open: false });
  const [loadingSave, setLoadingSave] = useState(false);

  const filteredTasks = tasks.filter(task =>
    task.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexUltimoItem = currentPage * itemsPerPage;
  const indexPrimeiroItem = indexUltimoItem - itemsPerPage;
  const tasksAtuais = filteredTasks.slice(indexPrimeiroItem, indexUltimoItem);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const buscarProdutos = async () => {
    try {
      const response = await api.get('/products');
      setTasks(response.data.data || response.data); // ajuste conforme seu backend
    } catch (error) {
      toaster.create({
        title: "Erro ao buscar produtos",
        description: error.message,
        type: "error",
      });
    }
  };

  useEffect(() => {
    buscarProdutos();
  }, []);

  const criarProduto = async (formValues) => {
    setLoadingSave(true);
    try {
      await api.post('/products', formValues);
      toaster.create({
        title: "Produto criado com sucesso",
        description: `Produto ${formValues.name} foi criado.`,
        type: "success",
      });
      await buscarProdutos();
      setOpenDialog({ open: false });
    } catch (error) {
      toaster.create({
        title: "Erro ao criar produto",
        description: error.response?.data?.message || error.message,
        type: "error",
      });
    }
    setLoadingSave(false);
  };

  const editarProduto = async (produto) => {
    try {
      await api.patch(`/products/${produto.id}`, produto);
      toaster.create({
        title: "Produto atualizado com sucesso",
        description: `Produto ${produto.name} foi atualizado.`,
        type: "success",
      });
      await buscarProdutos();
    } catch (error) {
      toaster.create({
        title: "Erro ao atualizar produto",
        description: error.response?.data?.message || error.message,
        type: "error",
      });
    }
  };

  const excluirProduto = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      setTasks(tasks.filter((task) => task.id !== id));
      toaster.create({
        title: "Produto excluído com sucesso",
        description: `Produto com ID ${id} foi removido.`,
        type: "success",
      });
    } catch (error) {
      toaster.create({
        title: "Erro ao excluir produto",
        description: error.response?.data?.message || error.message,
        type: "error",
      });
    }
  };

  return (
    <Box minH="100vh" w="100vw" p={8} boxShadow="lg" style={{ background: "rgba(15, 37, 65, 0.97)" }}>
      <Flex justifyContent="center">
        <Heading mb={12} gapX={2} display="flex">
          CRUD Produtos <MdMoreTime />
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
                { name: "name", placeholder: "Ex: Camiseta", title: "Nome:" },
                { name: "price", placeholder: "Ex: 99.90", title: "Preço:" },
                { name: "image", placeholder: "URL da imagem", title: "Imagem:" },
                { name: "description", placeholder: "Descrição do produto", title: "Descrição:" },
                { name: "district", placeholder: "Ex: Centro", title: "Bairro:" },
                { name: "numberForget", placeholder: "Ex: 123", title: "Número Forget:" },
                { name: "idCategory", placeholder: "ID da categoria", title: "Categoria (ID):" },
              ]}
              submit={criarProduto}
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
            { key: "price", label: "Preço" },
            { key: "image", label: "Imagem" },
            { key: "description", label: "Descrição" },
            { key: "district", label: "Bairro" },
            { key: "numberForget", label: "Número Forget" },
            { key: "idCategory", label: "Categoria (ID)" },
          ]}
          onEdit={editarProduto}
          onDelete={excluirProduto}
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