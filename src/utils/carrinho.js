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

  adicionaFrete(valor) {
    this.frete = valor;
  }

  calculaSubtotal() {
    this.subtotal = this.itens.reduce((acum, item) => {
      if (typeof item.pegaValorTotalItem === "function") {
        return acum + item.pegaValorTotalItem();
      }
      if (typeof item.preco === "number" && typeof item.quantidade === "number") {
        return acum + (item.preco * item.quantidade);
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

  limpar() {
    this.itens = [];
    this.subtotal = 0;
    this.frete = 0;
    this.total = 0;
  }
}

export default Carrinho;