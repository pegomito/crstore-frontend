import React, { useEffect, useState } from "react";
import { Box, Button, Input, Text, VStack, Flex, IconButton } from "@chakra-ui/react";
import api from "@/utils/axios";
import EditDialog from "./EditDialog";
import { toaster } from "./ui/toaster";
import { MdDelete, MdMode } from "react-icons/md";


export default function Adress() {
  const [enderecos, setEnderecos] = useState([]);
  const [loadingEndereco, setLoadingEndereco] = useState(false);

  const [novoEndereco, setNovoEndereco] = useState({
    zipCode: "",
    state: "",
    city: "",
    street: "",
    district: "",
    numberForget: ""
  });

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    buscarEndereco();
  }, []);

  const buscarEndereco = async () => {
    const res = await api.get("/adresses");
    setEnderecos(res.data.data || []);
  };

  const addAdress = async () => {
    if (
      !novoEndereco.zipCode ||
      !novoEndereco.state ||
      !novoEndereco.city ||
      !novoEndereco.street ||
      !novoEndereco.district
    ) {
      toaster.create({
        title: "Preencha todos os campos obrigatórios.",
        status: "warning",
        duration: 3000,
        isClosable: true
      });
      return;
    }
    setLoadingEndereco(true);
    try {
      const res = await api.post("/adresses", novoEndereco);
      setEnderecos([res.data.data, ...enderecos]);
      setNovoEndereco({
        zipCode: "",
        state: "",
        city: "",
        street: "",
        district: "",
        numberForget: ""
      });
    } catch (err) {
  console.error("Erro ao editar endereço:", err.response?.data || err.message || err);
  alert(err.response?.data?.message || err.message || "Erro ao editar endereço");
}
    setLoadingEndereco(false);
  };

  const deletarAdress = async (id) => {
    try {
      await api.delete(`/adresses/${id}`);
      setEnderecos(enderecos.filter((e) => e.id !== id));
      toaster.create({
      title: "Informações deeltadas com sucesso!",
      description: "Os dados foram salvos.",
      type: "success"
    });
    } catch (err) {
      alert("Erro ao excluir endereço");
    }
  };

  const editAdress = (item) => {
    setEditItem(item);
    setEditDialogOpen(true);
  };

  const saveEdit = async (edited) => {
  try {
    const res = await api.patch(`/adresses/${edited.id}`, edited);
    setEnderecos(enderecos.map((e) => (e.id === edited.id ? res.data.data : e)));
    setEditDialogOpen(false);

     toaster.create({
      title: "Informações atualizadas com sucesso!",
      description: "Os dados foram salvos.",
      type: "success"
    });
    
  } catch (error) {
    console.error("Erro ao editar endereço:", error.response?.data || error.message || error);
    toaster.create({
      title: "Erro ao editar endereço",
      description: error.response?.data?.message || error.message || "Erro ao editar endereço",
      type: "error"
    });
  }
};

  const headers = [
    { key: "id", label: "ID" },
    { key: "zipCode", label: "CEP" },
    { key: "state", label: "Estado" },
    { key: "city", label: "Cidade" },
    { key: "street", label: "Rua" },
    { key: "district", label: "Bairro" },
    { key: "numberForget", label: "Número" }
  ];

  return (
    <Box flex="1" p={8} display="flex" flexDirection="column" alignItems="center" w="100%">
      <Text color="white.300" fontSize="2xl" mb={6} fontWeight="bold">
        Seus Endereços
      </Text>
      <EditDialog
        isOpen={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        item={editItem}
        headers={headers}
        onSave={saveEdit}
      />
      
      
      {enderecos.length === 0 ? (
        <Text color="white" fontSize="md">Nenhum endereço cadastrado.</Text>
      ) : (
        <VStack spacing={4} align="stretch" w="100%" maxW="400px" p={4}>
          {enderecos.map((end, idx) => (
            <Box key={end.id || idx} p={4} bg="whiteAlpha.200" borderRadius="md">
              <Flex justify="space-between" align="center">
                <Box>
                  <Text color="white" fontWeight="bold">
                    {end.street}, {end.numberForget}
                  </Text>
                  <Text color="gray.200" fontSize="sm">
                    {end.district} - {end.city}/{end.state}
                  </Text>
                  <Text color="gray.400" fontSize="sm">
                    CEP: {end.zipCode}
                  </Text>
                </Box>
               <Flex gap={2}>
                          <Button
                              colorScheme="yellow"
                              variant="solid"
                              leftIcon={<MdMode />}
                              onClick={() => editAdress(end)}
                          >
                              Editar
                          </Button>
                          <Button
                              colorScheme="red"
                              variant="solid"
                              leftIcon={<MdDelete />}
                              onClick={() => deletarAdress(end.id)}
                          >
                              Excluir
                          </Button>
                      </Flex>
              </Flex>
            </Box>
          ))}
        </VStack>
      )}

       <Text color="white.300" fontSize="2xl" mb={6} mt={4} fontWeight="bold">
        Adicionar Novo Endereço
      </Text>

      <VStack spacing={3} align="stretch" w="100%" maxW="400px" mb={4}>
        <Input
          placeholder="CEP"
          bg="whiteAlpha.200"
          color="white"
          _placeholder={{ color: "whiteAlpha.600" }}
          value={novoEndereco.zipCode}
          onChange={e => setNovoEndereco({ ...novoEndereco, zipCode: e.target.value })}
        />
        <Input
          placeholder="Estado"
          bg="whiteAlpha.200"
          color="white"
          _placeholder={{ color: "whiteAlpha.600" }}
          value={novoEndereco.state}
          onChange={e => setNovoEndereco({ ...novoEndereco, state: e.target.value })}
        />
        <Input
          placeholder="Cidade"
          bg="whiteAlpha.200"
          color="white"
          _placeholder={{ color: "whiteAlpha.600" }}
          value={novoEndereco.city}
          onChange={e => setNovoEndereco({ ...novoEndereco, city: e.target.value })}
        />
        <Input
          placeholder="Rua"
          bg="whiteAlpha.200"
          color="white"
          _placeholder={{ color: "whiteAlpha.600" }}
          value={novoEndereco.street}
          onChange={e => setNovoEndereco({ ...novoEndereco, street: e.target.value })}
        />
        <Input
          placeholder="Bairro"
          bg="whiteAlpha.200"
          color="white"
          _placeholder={{ color: "whiteAlpha.600" }}
          value={novoEndereco.district}
          onChange={e => setNovoEndereco({ ...novoEndereco, district: e.target.value })}
        />
        <Input
          placeholder="Número"
          bg="whiteAlpha.200"
          color="white"
          _placeholder={{ color: "whiteAlpha.600" }}
          value={novoEndereco.numberForget}
          onChange={e => setNovoEndereco({ ...novoEndereco, numberForget: e.target.value })}
        />
      </VStack>
     <Button
        colorScheme="blue"
        mb={4}
        onClick={addAdress}
        isLoading={loadingEndereco}
        w="100%"
        maxW="400px"
      >
        Adicionar Endereço
      </Button>     
    </Box>
  );
}