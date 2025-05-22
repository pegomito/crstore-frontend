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

export default function TasksCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState({ open: false });
  const [loadingSave, setLoadingSave] = useState(false);

  const filteredCoupons = coupons.filter((coupon) =>
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexUltimoItem = currentPage * itemsPerPage;
  const indexPrimeiroItem = indexUltimoItem - itemsPerPage;
  const couponsAtuais = filteredCoupons.slice(indexPrimeiroItem, indexUltimoItem);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const buscarCoupons = async () => {
    try {
      const response = await api.get("/coupons");
      setCoupons(response.data.data || response.data);
    } catch (error) {
      toaster.create({
        title: "Erro ao buscar cupons",
        description: error.message,
        type: "error",
      });
    }
  };

  useEffect(() => {
    buscarCoupons();
  }, []);

  const criarCoupon = async (formValues) => {
    setLoadingSave(true);
    try {
      await api.post("/coupons", formValues);
      toaster.create({
        title: "Cupom criado com sucesso",
        description: `Cupom ${formValues.code} foi criado.`,
        type: "success",
      });
      await buscarCoupons();
      setOpenDialog({ open: false });
    } catch (error) {
      toaster.create({
        title: "Erro ao criar cupom",
        description: error.response?.data?.message || error.message,
        type: "error",
      });
    }
    setLoadingSave(false);
  };

  const editarCoupon = async (coupon) => {
    try {
      await api.patch(`/coupons/${coupon.id}`, coupon);
      toaster.create({
        title: "Cupom atualizado com sucesso",
        description: `Cupom ${coupon.code} foi atualizado.`,
        type: "success",
      });
      await buscarCoupons();
    } catch (error) {
      toaster.create({
        title: "Erro ao atualizar cupom",
        description: error.response?.data?.message || error.message,
        type: "error",
      });
    }
  };

  const excluirCoupon = async (id) => {
    try {
      await api.delete(`/coupons/${id}`);
      setCoupons(coupons.filter((coupon) => coupon.id !== id));
      toaster.create({
        title: "Cupom excluído com sucesso",
        description: `Cupom com ID ${id} foi removido.`,
        type: "success",
      });
    } catch (error) {
      toaster.create({
        title: "Erro ao excluir cupom",
        description: error.response?.data?.message || error.message,
        type: "error",
      });
    }
  };

  return (
    <Box minH="100vh" w="100vw" p={8} boxShadow="lg" style={{ background: "rgba(15, 37, 65, 0.97)" }}>
      <Flex justifyContent="center">
        <Heading mb={12} gapX={2} display="flex">
          CRUD Cupons <MdMoreTime />
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
                { name: "code", placeholder: "Ex: DESCONTO10", title: "Código:" },
                { name: "type", placeholder: "Ex: percentual ou valor", title: "Tipo:" },
                { name: "value", placeholder: "Ex: 10.00", title: "Valor:" },
                { name: "uses", placeholder: "Ex: 5", title: "Usos (opcional):" },
              ]}
              submit={criarCoupon}
              loadingSave={loadingSave}
              open={openDialog}
              setOpen={setOpenDialog}
            />
          </GridItem>
        </Grid>
      </Flex>
      <Stack style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <TabelaCrudAll
          items={couponsAtuais}
          headers={[
            { key: "id", label: "ID" },
            { key: "code", label: "Código" },
            { key: "type", label: "Tipo" },
            { key: "value", label: "Valor" },
            { key: "uses", label: "Usos" },
          ]}
          onEdit={editarCoupon}
          onDelete={excluirCoupon}
          acoes={true}
        />
        <Pagination.Root
          count={filteredCoupons.length}
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