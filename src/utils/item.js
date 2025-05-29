class Item {
  constructor(nome, preco, quantidade) {
    this.nome = nome;
    this.preco = preco;
    this.quantidade = quantidade;
  }

  pegaValorTotalItem() {
    return (this.preco || 0) * (this.quantidade || 0);
  }
}

export default Item;