"use client";

import TabelaCrudAll from "@/components/TabelaCrudAll";
import InputCreate from "@/components/InputCreate";
import api from "@/utils/axios";
import { toaster } from "@/components/ui/toaster";
import { MdChevronRight, MdChevronLeft, MdMoreTime } from "react-icons/md";
import React, { useState, useEffect } from "react";
import InputPesquisa from "@/components/InputPesquisa";
import {
  Box,
  Flex,
  Heading,
  Stack,
  Pagination,
  ButtonGroup,
  IconButton,
  GridItem,
  Grid,
} from "@chakra-ui/react";

export default function TasksOrderProducts() {
  const [orderProducts, setOrderProducts] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState({ open: false });
  const [loadingSave, setLoadingSave] = useState(false);

  const filteredOrderProducts = orderProducts.filter((item) =>
    item.id.toString().includes(searchTerm)
  );

  const indexUltimoItem = currentPage * itemsPerPage;
  const indexPrimeiroItem = indexUltimoItem - itemsPerPage;
  const orderProductsAtuais = filteredOrderProducts.slice(indexPrimeiroItem, indexUltimoItem);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const buscarOrderProducts = async () => {
    try {
      const response = await api.get("/order_products");
      setOrderProducts(response.data.data || response.data);
    } catch (error) {
      toaster.create({
        title: "Erro ao buscar relação pedido-produto",
        description: error.message,
        type: "error",
      });
    }
  };

  useEffect(() => {
    buscarOrderProducts();
  }, []);

  const criarOrderProduct = async (formValues) => {
    setLoadingSave(true);
    try {
      await api.post("/order_products", formValues);
      toaster.create({
        title: "Relação criada com sucesso",
        description: `Relação criada.`,
        type: "success",
      });
      await buscarOrderProducts();
      setOpenDialog({ open: false });
    } catch (error) {
      toaster.create({
        title: "Erro ao criar relação",
        description: error.response?.data?.message || error.message,
        type: "error",
      });
    }
    setLoadingSave(false);
  };

  const editarOrderProduct = async (item) => {
    try {
      await api.patch(`/order_products/${item.id}`, item);
      toaster.create({
        title: "Relação atualizada com sucesso",
        description: `Relação atualizada.`,
        type: "success",
      });
      await buscarOrderProducts();
    } catch (error) {
      toaster.create({
        title: "Erro ao atualizar relação",
        description: error.response?.data?.message || error.message,
        type: "error",
      });
    }
  };

  const excluirOrderProduct = async (id) => {
    try {
      await api.delete(`/order_products/${id}`);
      setOrderProducts(orderProducts.filter((item) => item.id !== id));
      toaster.create({
        title: "Relação excluída com sucesso",
        description: `Relação com ID ${id} foi removida.`,
        type: "success",
      });
    } catch (error) {
      toaster.create({
        title: "Erro ao excluir relação",
        description: error.response?.data?.message || error.message,
        type: "error",
      });
    }
  };

  return (
    <Box minH="100vh" w="100vw" p={8} boxShadow="lg" style={{ background: "rgba(15, 37, 65, 0.97)" }}>
      <Flex justifyContent="center">
        <Heading mb={12} gapX={2} display="flex">
          CRUD Pedido-Produto <MdMoreTime />
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
                { name: "priceProducts", placeholder: "Preço do produto", title: "Preço do Produto:" },
                { name: "quantity", placeholder: "Quantidade", title: "Quantidade:" },
                { name: "idOrder", placeholder: "ID do Pedido", title: "Pedido (ID):" },
                { name: "idProduct", placeholder: "ID do Produto", title: "Produto (ID):" },
              ]}
              submit={criarOrderProduct}
              loadingSave={loadingSave}
              open={openDialog}
              setOpen={setOpenDialog}
            />
          </GridItem>
        </Grid>
      </Flex>
      <Stack style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <TabelaCrudAll
          items={orderProductsAtuais}
          headers={[
            { key: "id", label: "ID" },
            { key: "priceProducts", label: "Preço do Produto" },
            { key: "quantity", label: "Quantidade" },
            { key: "idOrder", label: "Pedido (ID)" },
            { key: "idProduct", label: "Produto (ID)" },
          ]}
          onEdit={editarOrderProduct}
          onDelete={excluirOrderProduct}
          acoes={true}
        />
        <Pagination.Root
          count={filteredOrderProducts.length}
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