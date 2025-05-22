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

export default function TasksCategories() {
  const [categories, setCategories] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState({ open: false });
  const [loadingSave, setLoadingSave] = useState(false);

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexUltimoItem = currentPage * itemsPerPage;
  const indexPrimeiroItem = indexUltimoItem - itemsPerPage;
  const categoriesAtuais = filteredCategories.slice(indexPrimeiroItem, indexUltimoItem);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const buscarCategorias = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data.data || response.data);
    } catch (error) {
      toaster.create({
        title: "Erro ao buscar categorias",
        description: error.message,
        type: "error",
      });
    }
  };

  useEffect(() => {
    buscarCategorias();
  }, []);

  const criarCategoria = async (formValues) => {
    setLoadingSave(true);
    try {
      await api.post("/categories", formValues);
      toaster.create({
        title: "Categoria criada com sucesso",
        description: `Categoria ${formValues.name} foi criada.`,
        type: "success",
      });
      await buscarCategorias();
      setOpenDialog({ open: false });
    } catch (error) {
      toaster.create({
        title: "Erro ao criar categoria",
        description: error.response?.data?.message || error.message,
        type: "error",
      });
    }
    setLoadingSave(false);
  };

  const editarCategoria = async (categoria) => {
    try {
      await api.patch(`/categories/${categoria.id}`, categoria);
      toaster.create({
        title: "Categoria atualizada com sucesso",
        description: `Categoria ${categoria.name} foi atualizada.`,
        type: "success",
      });
      await buscarCategorias();
    } catch (error) {
      toaster.create({
        title: "Erro ao atualizar categoria",
        description: error.response?.data?.message || error.message,
        type: "error",
      });
    }
  };

  const excluirCategoria = async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      setCategories(categories.filter((cat) => cat.id !== id));
      toaster.create({
        title: "Categoria excluída com sucesso",
        description: `Categoria com ID ${id} foi removida.`,
        type: "success",
      });
    } catch (error) {
      toaster.create({
        title: "Erro ao excluir categoria",
        description: error.response?.data?.message || error.message,
        type: "error",
      });
    }
  };

  return (
    <Box minH="100vh" w="100vw" p={8} boxShadow="lg" style={{ background: "rgba(15, 37, 65, 0.97)" }}>
      <Flex justifyContent="center">
        <Heading mb={12} gapX={2} display="flex">
          CRUD Categorias <MdMoreTime />
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
                { name: "name", placeholder: "Ex: Camisetas", title: "Nome:" },
              ]}
              submit={criarCategoria}
              loadingSave={loadingSave}
              open={openDialog}
              setOpen={setOpenDialog}
            />
          </GridItem>
        </Grid>
      </Flex>
      <Stack style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <TabelaCrudAll
          items={categoriesAtuais}
          headers={[
            { key: "id", label: "ID" },
            { key: "name", label: "Nome" },
          ]}
          onEdit={editarCategoria}
          onDelete={excluirCategoria}
          acoes={true}
        />
        <Pagination.Root
          count={filteredCategories.length}
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