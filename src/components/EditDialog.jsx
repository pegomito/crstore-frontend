import { Dialog, Button, Input, Stack, Text, Portal } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { toaster, Toaster } from "./ui/toaster";

export default function EditDialog({ isOpen, onClose, item, headers, onSave }) {
  const [localItem, setLocalItem] = useState({});

  useEffect(() => {
    if (item) setLocalItem(item);
  }, [item]);

  const saveEdit = () => {
    onSave(localItem);
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Portal>
        <Dialog.Content
          key={item?.id}
          style={{
            background: "rgba(3, 9, 49)",
            borderRadius: 12,
            padding: 10,
            margin: 10,
            position: "fixed",
            top: "50%",
            left: "55%",
            transform: "translate(-50%, -50%)",
            minWidth: 340,
            maxWidth: 500,
            maxHeight: "80vh",
            overflow: "auto",
            zIndex: 1500,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Dialog.Header>
            <Dialog.Title>Editar Informações</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body style={{ flex: 1, overflowY: "auto" }}>
            {headers.map((header) => (
              <Stack key={header.key} mb={4}>
                <Text>{header.label}</Text>
                {header.key === "id" ? (
                  <Text>{localItem[header.key]}</Text>
                ) : header.key === "estudante" ? (
                  <Input
                    value={localItem[header.key] ? "Sim" : "Não"}
                    isReadOnly
                  />
                ) : (
                  <Input
                    value={localItem[header.key] || ""}
                    onChange={(e) =>
                      setLocalItem((prev) => ({
                        ...prev,
                        [header.key]: e.target.value,
                      }))
                    }
                  />
                )}
              </Stack>
            ))}
          </Dialog.Body>
          <Dialog.Footer style={{ marginTop: 16 }}>
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="teal" onClick={saveEdit}>
              Salvar
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Portal>
    </Dialog.Root>
  );
}