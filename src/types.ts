export interface Product {
  id: number;
  nome: string;
  preco: number;
  estoque: number;
  categoria: string;
}

export interface SaleItem {
  productId: number;
  quantidade: number;
  precoUnitario: number;
  nome: string;
}

export interface Sale {
  id: string;
  items: SaleItem[];
  total: number;
  metodoPagamento: string;
  data: string;
}

export type MenuOption = 'MAIN' | 'INVENTORY' | 'REGISTER_SALE' | 'SELECT_PRODUCTS' | 'PAYMENT' | 'RECEIPT';
