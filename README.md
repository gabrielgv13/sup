# SUP Caixa

Sistema de caixa com duas interfaces lado a lado:

- uma TUI inspirada em terminal
- uma interface nativa com visual de painel operacional

O projeto foi pensado para simular um PDV moderno, com fluxo de venda, estoque, pagamento e painel analítico.

## Funcionalidades

- menu principal no estilo terminal
- seleção de produtos por comando ou clique
- controle de estoque em tempo real
- finalização de venda com forma de pagamento
- total de vendas do dia no painel nativo
- painel analítico com gráficos de pizza para:
  - métodos de pagamento mais usados
  - produtos mais comprados

## Como executar

### Pré-requisitos

- Node.js

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
npm run dev
```

### Build de produção

```bash
npm run build
```

## GitHub Pages

O projeto está configurado para publicar automaticamente no GitHub Pages a cada push na branch `main`.

Link da aplicação publicada:

https://gabrielgv13.github.io/sup/

## Observação

O arquivo `.env.example` existe apenas como referência de configuração. Se você não for usar nenhuma chave externa, o app continua rodando normalmente com a configuração padrão.
