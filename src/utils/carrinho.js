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
    this.subtotal = this.itens.reduce((acum, item) => acum + item.pegaValorTotalItem(), 0);
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