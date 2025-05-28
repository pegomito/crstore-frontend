import { createContext, useContext, useState, useEffect } from "react";
import Carrinho from "@/utils/carrinho.js";
import Item from "@/utils/item.js";
import api from "@/utils/axios";

const CarrinhoContext = createContext();

export function CarrinhoProvider({ children }) {
  const [carrinho, setCarrinho] = useState(new Carrinho());

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;
    api.get("/cart", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        if (res.data && res.data.cart) {
          const backendCarrinho = Object.assign(new Carrinho(), res.data.cart);
          // Converte cada item em instância de Item
          backendCarrinho.itens = (backendCarrinho.itens || []).map(
            i => new Item(i.nome, i.preco, i.quantidade)
          );
          setCarrinho(backendCarrinho);
        }
      });
  }, []);

  function sincronizarCarrinhoBackend(novoCarrinho) {
    const token = localStorage.getItem("authToken");
    api.post("/cart", { cart: novoCarrinho }, { headers: { Authorization: `Bearer ${token}` } });
  }

  function adicionarProduto(produto, quantidade = 1) {
    const item = new Item(produto.name, Number(produto.price), quantidade);
    carrinho.adiciona(item);
    carrinho.calculaTotal();
    setCarrinho(Object.assign(new Carrinho(), carrinho));
    sincronizarCarrinhoBackend(carrinho);
  }

  function limparCarrinho() {
    carrinho.limpar();
    setCarrinho(new Carrinho());
    const token = localStorage.getItem("authToken");
    api.delete("/cart", { headers: { Authorization: `Bearer ${token}` } });
  }

  function adicionaFrete(valor) {
    carrinho.adicionaFrete(valor);
    carrinho.calculaTotal();
    setCarrinho(Object.assign(new Carrinho(), carrinho));
    sincronizarCarrinhoBackend(carrinho);
  }

  return (
    <CarrinhoContext.Provider value={{ carrinho, adicionarProduto, limparCarrinho, adicionaFrete }}>
      {children}
    </CarrinhoContext.Provider>
  );
}

export function useCarrinho() {
  return useContext(CarrinhoContext);
}