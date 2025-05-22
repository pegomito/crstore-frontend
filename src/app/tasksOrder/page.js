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

export default function TasksOrders() {
  const [orders, setOrders] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState({ open: false });
  const [loadingSave, setLoadingSave] = useState(false);

  const filteredOrders = orders.filter((order) =>
    order.id.toString().includes(searchTerm)
  );

  const indexUltimoItem = currentPage * itemsPerPage;
  const indexPrimeiroItem = indexUltimoItem - itemsPerPage;
  const ordersAtuais = filteredOrders.slice(indexPrimeiroItem, indexUltimoItem);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const buscarOrders = async () => {
    try {
      const response = await api.get("/orders");
      setOrders(response.data.data || response.data);
    } catch (error) {
      toaster.create({
        title: "Erro ao buscar pedidos",
        description: error.message,
        type: "error",
      });
    }
  };

  useEffect(() => {
    buscarOrders();
  }, []);

  const criarOrder = async (formValues) => {
    setLoadingSave(true);
    try {
      await api.post("/orders", formValues);
      toaster.create({
        title: "Pedido criado com sucesso",
        description: `Pedido criado.`,
        type: "success",
      });
      await buscarOrders();
      setOpenDialog({ open: false });
    } catch (error) {
      toaster.create({
        title: "Erro ao criar pedido",
        description: error.response?.data?.message || error.message,
        type: "error",
      });
    }
    setLoadingSave(false);
  };

  const editarOrder = async (order) => {
    try {
      await api.patch(`/orders/${order.id}`, order);
      toaster.create({
        title: "Pedido atualizado com sucesso",
        description: `Pedido atualizado.`,
        type: "success",
      });
      await buscarOrders();
    } catch (error) {
      toaster.create({
        title: "Erro ao atualizar pedido",
        description: error.response?.data?.message || error.message,
        type: "error",
      });
    }
  };

  const excluirOrder = async (id) => {
    try {
      await api.delete(`/orders/${id}`);
      setOrders(orders.filter((order) => order.id !== id));
      toaster.create({
        title: "Pedido excluído com sucesso",
        description: `Pedido com ID ${id} foi removido.`,
        type: "success",
      });
    } catch (error) {
      toaster.create({
        title: "Erro ao excluir pedido",
        description: error.response?.data?.message || error.message,
        type: "error",
      });
    }
  };

  return (
    <Box minH="100vh" w="100vw" p={8} boxShadow="lg" style={{ background: "rgba(15, 37, 65, 0.97)" }}>
      <Flex justifyContent="center">
        <Heading mb={12} gapX={2} display="flex">
          CRUD Pedidos <MdMoreTime />
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
                { name: "status", placeholder: "Ex: entregue", title: "Status:" },
                { name: "total", placeholder: "Ex: 199.90", title: "Total:" },
                { name: "totalDiscount", placeholder: "Ex: 10.00", title: "Desconto Total:" },
                { name: "idUserCostumer", placeholder: "ID do Cliente", title: "Cliente (ID):" },
                { name: "idUserDelivery", placeholder: "ID do Entregador", title: "Entregador (ID):" },
                { name: "idAdress", placeholder: "ID do Endereço", title: "Endereço (ID):" },
                { name: "idPayment", placeholder: "ID do Pagamento", title: "Pagamento (ID):" },
                { name: "idCoupon", placeholder: "ID do Cupom", title: "Cupom (ID):" },
              ]}
              submit={criarOrder}
              loadingSave={loadingSave}
              open={openDialog}
              setOpen={setOpenDialog}
            />
          </GridItem>
        </Grid>
      </Flex>
      <Stack style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <TabelaCrudAll
          items={ordersAtuais}
          headers={[
            { key: "id", label: "ID" },
            { key: "status", label: "Status" },
            { key: "total", label: "Total" },
            { key: "totalDiscount", label: "Desconto Total" },
            { key: "idUserCostumer", label: "Cliente (ID)" },
            { key: "idUserDelivery", label: "Entregador (ID)" },
            { key: "idAdress", label: "Endereço (ID)" },
            { key: "idPayment", label: "Pagamento (ID)" },
            { key: "idCoupon", label: "Cupom (ID)" },
          ]}
          onEdit={editarOrder}
          onDelete={excluirOrder}
          acoes={true}
        />
        <Pagination.Root
          count={filteredOrders.length}
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