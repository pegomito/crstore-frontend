import { createContext, useContext, useState } from "react";
import Carrinho from "@/utils/carrinho.js";
import Item from "@/utils/item.js";

const CarrinhoContext = createContext();

export function CarrinhoProvider({ children }) {
  const [carrinho, setCarrinho] = useState(new Carrinho());

  function adicionarProduto(produto, quantidade = 1) {
    const item = new Item(produto.name, Number(produto.price), quantidade);
    carrinho.adiciona(item);
    carrinho.calculaTotal();
    setCarrinho(Object.assign(new Carrinho(), carrinho));
  }

  function limparCarrinho() {
    carrinho.limpar();
    setCarrinho(new Carrinho());
  }

  function adicionaFrete(valor) {
    carrinho.adicionaFrete(valor);
    carrinho.calculaTotal();
    setCarrinho(Object.assign(new Carrinho(), carrinho));
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