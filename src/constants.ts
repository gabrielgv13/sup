import { Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  { id: 1, nome: 'Arroz 5kg', preco: 25.50, estoque: 50, categoria: 'Grãos' },
  { id: 2, nome: 'Feijão 1kg', preco: 8.90, estoque: 30, categoria: 'Grãos' },
  { id: 3, nome: 'Leite 1L', preco: 4.50, estoque: 100, categoria: 'Laticínios' },
  { id: 4, nome: 'Café 500g', preco: 15.00, estoque: 40, categoria: 'Bebidas' },
  { id: 5, nome: 'Açúcar 1kg', preco: 4.20, estoque: 60, categoria: 'Mercearia' },
  { id: 6, nome: 'Óleo de Soja', preco: 7.80, estoque: 35, categoria: 'Mercearia' },
  { id: 7, nome: 'Biscoito Recheado', preco: 3.50, estoque: 80, categoria: 'Doces' },
  { id: 8, nome: 'Pão de Forma', preco: 6.50, estoque: 25, categoria: 'Padaria' },
];

export const PORTUGOL_SNIPPETS = {
  MAIN: `programa {
  funcao inicio() {
    inteiro opcao
    faca {
      escreva("--- MENU SUPERMERCADO ---")
      escreva("1. Ver Estoque")
      escreva("2. Registrar Venda")
      escreva("3. Sair")
      leia(opcao)
      
      escolha(opcao) {
        caso 1: ver_estoque()
        caso 2: registrar_venda()
      }
    } enquanto(opcao != 3)
  }
}`,
  INVENTORY: `funcao ver_estoque() {
  para (inteiro i=0; i < total_produtos; i++) {
    escreva(produtos[i].nome, " - Qtd: ", produtos[i].estoque)
  }
}`,
  REGISTER_SALE: `funcao registrar_venda() {
  inteiro cod, qtd
  escreva("Digite o código do produto:")
  leia(cod)
  escreva("Quantidade:")
  leia(qtd)
  
  se (estoque[cod] >= qtd) {
    total += preco[cod] * qtd
    estoque[cod] -= qtd
  } senao {
    escreva("Estoque insuficiente!")
  }
}`,
  PAYMENT: `funcao selecionar_pagamento() {
  escreva("1. Dinheiro / 2. Cartão / 3. PIX")
  leia(metodo)
  emitir_nota()
}`,
  RECEIPT: `funcao emitir_nota() {
  escreva("--- NOTA FISCAL ---")
  escreva("Total: R$ ", total)
  escreva("Obrigado pela preferência!")
}`
};
