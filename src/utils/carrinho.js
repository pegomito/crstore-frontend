class Carrinho {
  constructor() {
    this.itens = [];
    this.subtotal = 0;
    this.frete = 0;
    this.total = 0;
  }

  adiciona(item) {
    this.itens.push(item);
  }


  calculaSubtotal() {
    this.subtotal = this.itens.reduce((acum, item) => {
      if (typeof item.preco === "number" && typeof item.quantidade === "number") {
        return acum + (item.preco * item.quantidade);
      }
      if (typeof item.pegaValorTotalItem === "function") {
        return acum + item.pegaValorTotalItem();
      }
      return acum;
    }, 0);
    return this.subtotal;
  }

  calculaTotal() {
    this.calculaSubtotal();
    this.total = this.subtotal + this.frete;
    return this.total;
  }

  finalizaCompra() {
    if (this.itens.length === 0) {
      throw new Error('Carrinho de compras vazio');
    }
    this.calculaTotal();
    return {
      subtotal: this.subtotal,
      frete: this.frete,
      total: this.total,
      itens: this.itens,
    };
  }

  removerItem(idx) {
    this.itens.splice(idx, 1);
  }

  limpar() {
    this.itens = [];
    this.subtotal = 0;
    this.frete = 0;
    this.total = 0;
  }
}

export default Carrinho;