import { createContext, useContext, useState, useEffect } from "react";
import Carrinho from "@/utils/carrinho.js";
import Item from "@/utils/item.js";
import api from "@/utils/axios";

const CarrinhoContext = createContext();

export function CarrinhoProvider({ children }) {
  const [carrinho, setCarrinho] = useState(new Carrinho());
  const [token, setToken] = useState(null);
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("authToken"));
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onStorage = () => setToken(localStorage.getItem("authToken"));
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!token) {
      setCarrinho(new Carrinho());
      return;
    }
    api.get("/cart", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        if (res.data && res.data.cart) {
          const backendCarrinho = Object.assign(new Carrinho(), res.data.cart);
          backendCarrinho.itens = (backendCarrinho.itens || []).map(
            i => new Item(
              i.nome,
              typeof i.preco === "number" ? i.preco : Number(i.valor) || 0,
              i.quantidade
            )
          );
          setCarrinho(backendCarrinho);
        }
      });
  }, [token]);

  function sincronizarCarrinhoBackend(novoCarrinho) {
    if (!token) return;
    api.post("/cart", { cart: novoCarrinho }, { headers: { Authorization: `Bearer ${token}` } });
  }

  function adicionarProduto(produto, quantidade = 1) {
    const preco = Number(produto.price ?? produto.preco ?? produto.valor) || 0;
    const item = new Item(produto.name ?? produto.nome, preco, quantidade);
    carrinho.adiciona(item);
    carrinho.calculaTotal();
    setCarrinho(Object.assign(new Carrinho(), carrinho));
    sincronizarCarrinhoBackend(carrinho);
  }

  function limparCarrinho() {
    carrinho.limpar();
    setCarrinho(new Carrinho());
    if (!token) return;
    api.delete("/cart", { headers: { Authorization: `Bearer ${token}` } });
  }

  function removerItem(idx) {
    const novoCarrinho = Object.assign(new Carrinho(), carrinho);
    novoCarrinho.removerItem(idx);
    novoCarrinho.calculaTotal();
    setCarrinho(novoCarrinho);
    sincronizarCarrinhoBackend(novoCarrinho);
  }

  return (
    <CarrinhoContext.Provider value={{ carrinho, adicionarProduto, limparCarrinho, removerItem }}>
      {children}
    </CarrinhoContext.Provider>
  );
}

export function useCarrinho() {
  return useContext(CarrinhoContext);
}