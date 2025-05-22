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

export default function TasksAdresses() {
  const [adresses, setAdresses] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState({ open: false });
  const [loadingSave, setLoadingSave] = useState(false);

  const filteredAdresses = adresses.filter((adress) =>
    adress.street.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexUltimoItem = currentPage * itemsPerPage;
  const indexPrimeiroItem = indexUltimoItem - itemsPerPage;
  const adressesAtuais = filteredAdresses.slice(indexPrimeiroItem, indexUltimoItem);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const buscarAdresses = async () => {
    try {
      const response = await api.get("/adresses");
      setAdresses(response.data.data || response.data);
    } catch (error) {
      toaster.create({
        title: "Erro ao buscar endereços",
        description: error.message,
        type: "error",
      });
    }
  };

  useEffect(() => {
    buscarAdresses();
  }, []);

  const criarAdress = async (formValues) => {
    setLoadingSave(true);
    try {
      await api.post("/adresses", formValues);
      toaster.create({
        title: "Endereço criado com sucesso",
        description: `Endereço ${formValues.street} foi criado.`,
        type: "success",
      });
      await buscarAdresses();
      setOpenDialog({ open: false });
    } catch (error) {
      toaster.create({
        title: "Erro ao criar endereço",
        description: error.response?.data?.message || error.message,
        type: "error",
      });
    }
    setLoadingSave(false);
  };

  const editarAdress = async (adress) => {
    try {
      await api.patch(`/adresses/${adress.id}`, adress);
      toaster.create({
        title: "Endereço atualizado com sucesso",
        description: `Endereço ${adress.street} foi atualizado.`,
        type: "success",
      });
      await buscarAdresses();
    } catch (error) {
      toaster.create({
        title: "Erro ao atualizar endereço",
        description: error.response?.data?.message || error.message,
        type: "error",
      });
    }
  };

  const excluirAdress = async (id) => {
    try {
      await api.delete(`/adresses/${id}`);
      setAdresses(adresses.filter((adress) => adress.id !== id));
      toaster.create({
        title: "Endereço excluído com sucesso",
        description: `Endereço com ID ${id} foi removido.`,
        type: "success",
      });
    } catch (error) {
      toaster.create({
        title: "Erro ao excluir endereço",
        description: error.response?.data?.message || error.message,
        type: "error",
      });
    }
  };

  return (
    <Box minH="100vh" w="100vw" p={8} boxShadow="lg" style={{ background: "rgba(15, 37, 65, 0.97)" }}>
      <Flex justifyContent="center">
        <Heading mb={12} gapX={2} display="flex">
          CRUD Endereços <MdMoreTime />
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
                { name: "zipCode", placeholder: "Ex: 12345-678", title: "CEP:" },
                { name: "state", placeholder: "Ex: SP", title: "Estado:" },
                { name: "city", placeholder: "Ex: São Paulo", title: "Cidade:" },
                { name: "street", placeholder: "Ex: Av. Paulista", title: "Rua:" },
                { name: "district", placeholder: "Ex: Centro", title: "Bairro:" },
                { name: "numberForget", placeholder: "Ex: 123", title: "Número:" },
              ]}
              submit={criarAdress}
              loadingSave={loadingSave}
              open={openDialog}
              setOpen={setOpenDialog}
            />
          </GridItem>
        </Grid>
      </Flex>
      <Stack style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <TabelaCrudAll
          items={adressesAtuais}
          headers={[
            { key: "id", label: "ID" },
            { key: "zipCode", label: "CEP" },
            { key: "state", label: "Estado" },
            { key: "city", label: "Cidade" },
            { key: "street", label: "Rua" },
            { key: "district", label: "Bairro" },
            { key: "numberForget", label: "Número" },
          ]}
          onEdit={editarAdress}
          onDelete={excluirAdress}
          acoes={true}
        />
        <Pagination.Root
          count={filteredAdresses.length}
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