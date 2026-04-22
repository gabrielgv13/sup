/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingCart, 
  Package, 
  FileText, 
  ArrowLeft, 
  ChevronRight, 
  Info,
  Terminal as TerminalIcon,
  Code2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Product, SaleItem, Sale, MenuOption } from './types';
import { INITIAL_PRODUCTS, PORTUGOL_SNIPPETS } from './constants';

export default function App() {
  const [currentMenu, setCurrentMenu] = useState<MenuOption>('MAIN');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [lastSale, setLastSale] = useState<Sale | null>(null);
  const [terminalLogs, setTerminalLogs] = useState<string[]>(['SISTEMA INICIALIZADO...', 'CARREGANDO MODULO_VENDAS.por...', 'PRONTO.']);
  const [commandInput, setCommandInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const addLog = (message: string) => {
    setTerminalLogs(prev => [...prev, message]);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [terminalLogs]);

  const handleCommand = (cmd: string) => {
    const input = cmd.toLowerCase().trim();
    
    // Global Navigation
    if (input === 'esc' || input === 'voltar') {
      setCurrentMenu('MAIN');
      addLog(`$ executando: menu_principal()`);
      setCommandInput('');
      return;
    }

    if (currentMenu === 'MAIN') {
      if (input === '1') {
        setCurrentMenu('INVENTORY');
        addLog(`$ executando: ver_estoque()`);
      } else if (input === '2') {
        setCurrentMenu('SELECT_PRODUCTS');
        addLog(`$ executando: registrar_venda()`);
      } else if (input === 'cls' || input === 'limpar') {
        setTerminalLogs(['SISTEMA REINICIALIZADO.']);
      } else {
        addLog(`$ erro: comando '${input}' não reconhecido.`);
      }
    } else if (currentMenu === 'SELECT_PRODUCTS') {
      if (input === '0' || input === 'checkout' || input === 'f') {
        if (cart.length > 0) {
          setCurrentMenu('PAYMENT');
          addLog(`$ executando: selecionar_pagamento()`);
        } else {
          addLog(`$ erro: carrinho vazio.`);
        }
      } else {
        const prodId = parseInt(input);
        const product = products.find(p => p.id === prodId);
        if (product) {
          handleSelectProduct(product, 1);
        } else if (input === 'v') {
          setCurrentMenu('MAIN');
        } else {
          addLog(`$ erro: ID do produto '${input}' inválido.`);
        }
      }
    } else if (currentMenu === 'INVENTORY') {
      if (input === 'v') setCurrentMenu('MAIN');
    } else if (currentMenu === 'PAYMENT') {
      if (input === '1') {
        setPaymentMethod('Dinheiro');
        addLog(`$ pagamento: Dinheiro selecionado.`);
      } else if (input === '2') {
        setPaymentMethod('Cartão Crédito/Débito');
        addLog(`$ pagamento: Cartão selecionado.`);
      } else if (input === '3') {
        setPaymentMethod('PIX');
        addLog(`$ pagamento: PIX selecionado.`);
      } else if (input === 'confirmar' || input === 'f' || (paymentMethod && input === '4')) {
        if (paymentMethod) finalizeSale();
        else addLog(`$ erro: selecione o método primeiro.`);
      } else if (input === 'v') {
        setCurrentMenu('SELECT_PRODUCTS');
      }
    } else if (currentMenu === 'RECEIPT') {
      if (input === 'nova' || input === '1') {
        setCurrentMenu('MAIN');
        addLog(`$ reset_sessao.sh`);
      }
    }
    
    setCommandInput('');
  };

  const handleSelectProduct = (product: Product, quantity: number) => {
    if (product.estoque < quantity) {
      addLog(`$ erro: estoque insuficiente para ${product.nome}`);
      return;
    }

    const existingItem = cart.find(item => item.productId === product.id);
    if (existingItem) {
      setCart(prev => prev.map(item => 
        item.productId === product.id 
          ? { ...item, quantidade: item.quantidade + quantity } 
          : item
      ));
    } else {
      setCart(prev => [...prev, {
        productId: product.id,
        nome: product.nome,
        precoUnitario: product.preco,
        quantidade: quantity
      }]);
    }

    setProducts(prev => prev.map(p => 
      p.id === product.id ? { ...p, estoque: p.estoque - quantity } : p
    ));
    
    addLog(`$ item_adicionado: ${product.nome} (Preço: ${product.preco})`);
  };

  const finalizeSale = () => {
    const total = cart.reduce((acc, item) => acc + (item.precoUnitario * item.quantidade), 0);
    const newSale: Sale = {
      id: Math.random().toString(36).substr(2, 6).toUpperCase(),
      items: [...cart],
      total,
      metodoPagamento: paymentMethod,
      data: new Date().toLocaleString('pt-BR')
    };
    setLastSale(newSale);
    setCart([]);
    setPaymentMethod('');
    setCurrentMenu('RECEIPT');
    addLog(`$ venda_confirmada: ID=${newSale.id} TOTAL=${total}`);
  };

  const totalCart = cart.reduce((acc, item) => acc + (item.precoUnitario * item.quantidade), 0);

  return (
    <div className="flex flex-col h-screen bg-[#1e1e1e] text-[#cccccc] font-sans select-none overflow-hidden">
      {/* Top Header */}
      <header className="border-b border-[#333333] p-4 flex justify-between items-center bg-[#252526]">
        <div className="flex items-center gap-3">
          <TerminalIcon className="text-emerald-500 w-5 h-5" />
          <h1 className="text-xs font-black tracking-[0.2em] flex items-center gap-2">
            SUPERMERCADO <span className="text-emerald-500">SYNERGY</span>
            <span className="text-[10px] text-zinc-600 font-normal">TERMINAL EDITION</span>
          </h1>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Sincronização em Tempo Real Ativa
        </div>
      </header>

      <main className="flex-1 p-6 grid grid-cols-2 gap-8 overflow-hidden">
        {/* LEFT: TUI (Terminal User Interface) */}
        <section className="bg-[#1e1e1e] border border-[#333333] rounded-lg flex flex-col overflow-hidden shadow-2xl">
          <div className="bg-[#252526] px-3 py-1 flex justify-between items-center text-[10px] text-zinc-500 font-mono border-b border-[#333333]">
            <span>MODULO_LOGICA_VENDAS.por</span>
            <span className="opacity-50">UTF-8</span>
          </div>
          
          <div className="flex-1 p-6 font-mono text-[13px] overflow-y-auto terminal-scroll" ref={scrollRef}>
            <div className="space-y-0.5 mb-8">
              {terminalLogs.map((log, i) => (
                <div key={i} className="flex gap-2">
                  <span className={log.startsWith('$') ? 'text-zinc-500' : 'text-emerald-500'}>{log}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-[#333333] pt-4 space-y-4">
              <AnimatePresence mode="wait">
                {currentMenu === 'MAIN' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="text-zinc-500 mb-2">// MENU PRINCIPAL</div>
                    <div className="text-emerald-500">1. VER ESTOQUE</div>
                    <div className="text-emerald-500">2. REGISTRAR VENDA</div>
                    <div className="text-emerald-500">3. LIMPAR RELATÓRIO</div>
                  </motion.div>
                )}
                
                {currentMenu === 'SELECT_PRODUCTS' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="text-zinc-500 border-b border-[#333333] pb-1">// SELEÇÃO DE PRODUTOS</div>
                    <div className="space-y-0.5 text-xs text-zinc-300">
                      {products.map(p => (
                        <div key={p.id} className="flex justify-between">
                          <span>{p.id}. {p.nome}</span>
                          <span className="opacity-50">R$ {p.preco.toFixed(2)} [Est:{p.estoque}]</span>
                        </div>
                      ))}
                    </div>
                    <div className="text-zinc-500 text-[11px]">
                      ID p/ adicionar | <span className="text-white font-bold">0</span>. Checkout | <span className="text-white font-bold">V</span>. Voltar
                    </div>
                  </motion.div>
                )}

                {currentMenu === 'INVENTORY' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                    <div className="text-zinc-500">// ESTOQUE ATUAL</div>
                    <div className="space-y-0.5 text-xs">
                      {products.map(p => (
                        <div key={p.id} className="flex justify-between text-zinc-300">
                          <span>{p.nome}</span>
                          <span>{p.estoque} un</span>
                        </div>
                      ))}
                    </div>
                    <div className="text-zinc-500 text-[11px]">Digite <span className="text-emerald-500">V</span> para voltar.</div>
                  </motion.div>
                )}

                {currentMenu === 'PAYMENT' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                    <div className="text-zinc-500">// PAGAMENTO</div>
                    <div className="text-xs space-y-1">
                      <div className={paymentMethod === 'Dinheiro' ? 'text-white underline' : 'text-zinc-500'}>1. Dinheiro</div>
                      <div className={paymentMethod === 'Cartão Crédito/Débito' ? 'text-white underline' : 'text-zinc-500'}>2. Cartão</div>
                      <div className={paymentMethod === 'PIX' ? 'text-white underline' : 'text-zinc-500'}>3. PIX</div>
                    </div>
                    <div className="text-zinc-500 text-[10px]">
                      <span className="text-emerald-500">F</span> p/ finalizar | <span className="text-emerald-500">V</span> p/ voltar
                    </div>
                  </motion.div>
                )}

                {currentMenu === 'RECEIPT' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                    <div className="text-emerald-500 font-bold">// VENDA REALIZADA COM SUCESSO.</div>
                    <div className="text-[11px] text-zinc-500 font-mono">ID: {lastSale?.id} | Total: R${lastSale?.total.toFixed(2)}</div>
                    <div className="text-zinc-500 text-[11px] mt-4">Digite <span className="text-emerald-500">1</span> para nova venda.</div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center gap-3 mt-8 bg-black/40 p-3 rounded-lg border border-emerald-500/30 focus-within:border-emerald-500 transition-all group shadow-[0_0_15px_rgba(16,185,129,0.05)]">
                <span className="text-zinc-500 text-xs font-bold tracking-tighter">~/caixa</span>
                <span className="text-emerald-500 font-bold">$</span>
                <input 
                  type="text" 
                  value={commandInput}
                  onChange={(e) => setCommandInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCommand(commandInput)}
                  className="bg-transparent border-none outline-none flex-1 text-white placeholder-zinc-700 font-bold"
                  placeholder="DIGITE O COMANDO AQUI..."
                  autoFocus
                />
                <div className="w-2 h-4 bg-emerald-500 animate-[pulse_1s_infinite] group-focus-within:block hidden" />
              </div>
            </div>
          </div>
          
          <div className="p-3 border-t border-[#333333] bg-[#252526] text-[10px] text-zinc-600 font-mono flex items-center gap-3">
            <Code2 size={12} className="text-zinc-500" />
            <span className="truncate italic flex-1">
              {PORTUGOL_SNIPPETS[currentMenu === 'SELECT_PRODUCTS' || currentMenu === 'REGISTER_SALE' ? 'REGISTER_SALE' : currentMenu as keyof typeof PORTUGOL_SNIPPETS].split('\n').slice(0, 3).join(' ')}...
            </span>
          </div>
        </section>

        {/* RIGHT: Modern/Usable Interface */}
        <section className="modern-container">
          <div className="px-6 py-4 bg-zinc-50 border-b border-zinc-200 flex justify-between items-center">
            <h2 className="text-sm font-black text-zinc-900 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                <ShoppingCart size={16} />
              </div>
              PORTAL DO OPERADOR
            </h2>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-200" />
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-200" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 bg-zinc-50/50 terminal-scroll font-sans">
            <AnimatePresence mode="wait">
              {currentMenu === 'MAIN' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                   <div className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm">
                     <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200 transition-transform hover:scale-105">
                          <Package size={28} />
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-zinc-900">Dashboard Loja</h3>
                          <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mt-1">Status do Terminal 01</p>
                        </div>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-100 transition-colors hover:bg-zinc-100">
                           <div className="text-[10px] font-black text-zinc-400 uppercase mb-1">Vendas Hoje</div>
                           <div className="text-2xl font-black text-zinc-900 font-mono tracking-tight">R$ 1.240,50</div>
                        </div>
                        <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-100 transition-colors hover:bg-zinc-100">
                           <div className="text-[10px] font-black text-zinc-400 uppercase mb-1">Alertas Estoque</div>
                           <div className="text-2xl font-black text-amber-500 font-mono">
                             {products.filter(p => p.estoque < 10).length}
                           </div>
                        </div>
                     </div>
                   </div>

                   <div className="grid grid-cols-1 gap-4">
                      <div className="bg-zinc-900 p-6 rounded-3xl text-white flex items-center justify-between group cursor-pointer hover:bg-emerald-600 transition-all shadow-xl" onClick={() => handleCommand('2')}>
                        <div className="space-y-1">
                          <div className="text-emerald-400 group-hover:text-white text-[10px] font-black uppercase tracking-widest">Ação Necessária</div>
                          <div className="text-xl font-bold">Abrir Novo Check-out</div>
                        </div>
                        <ChevronRight className="opacity-40 group-hover:opacity-100 transition-opacity" size={24} />
                      </div>

                      <div className="bg-white p-6 rounded-3xl border border-zinc-100 flex items-center justify-between group cursor-pointer hover:border-zinc-300 transition-all shadow-sm" onClick={() => handleCommand('1')}>
                         <div className="space-y-1">
                          <div className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">Painel Administrativo</div>
                          <div className="text-xl font-bold text-zinc-900">Gerenciar Estoque</div>
                        </div>
                        <ChevronRight className="text-zinc-300 group-hover:text-zinc-900 transition-colors" size={24} />
                      </div>
                   </div>
                </motion.div>
              )}

              {currentMenu === 'INVENTORY' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm mb-4">
                     <h3 className="font-black text-zinc-900 uppercase text-xs tracking-widest">Relatório de Estoque</h3>
                     <button onClick={() => setCurrentMenu('MAIN')} className="text-[10px] font-black text-emerald-600 hover:bg-emerald-50 px-4 py-2 rounded-full transition-all border border-emerald-100 flex items-center gap-2">
                        <ArrowLeft size={14} /> VOLTAR AO INÍCIO
                     </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {products.map(p => (
                      <div key={p.id} className="bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm flex flex-col justify-between transition-all hover:shadow-md">
                         <div>
                          <div className="text-[10px] text-zinc-400 font-bold mb-1 uppercase tracking-widest">{p.categoria}</div>
                          <div className="font-bold text-zinc-900">{p.nome}</div>
                         </div>
                         <div className="mt-6 flex justify-between items-end border-t border-zinc-50 pt-3">
                            <div className="text-[10px] font-bold text-zinc-500">SALDO: {p.estoque} UN</div>
                            <div className="font-black text-emerald-600 font-mono">R$ {p.preco.toFixed(2)}</div>
                         </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {currentMenu === 'SELECT_PRODUCTS' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full space-y-6">
                  <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm">
                     <h3 className="font-black text-zinc-900 uppercase text-xs tracking-widest">Frente de Caixa Ativo</h3>
                     <button onClick={() => setCurrentMenu('MAIN')} className="text-[10px] font-black text-red-500 hover:bg-red-50 px-4 py-2 rounded-full transition-all border border-red-100">
                        CANCELAR VENDA
                     </button>
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-2 mb-4 pr-1 terminal-scroll overflow-y-auto">
                    {products.map(p => (
                      <button 
                        key={p.id} 
                        onClick={() => handleSelectProduct(p, 1)}
                        disabled={p.estoque === 0}
                        className="bg-white p-3 rounded-xl border border-zinc-100 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all text-left flex flex-col justify-between group disabled:opacity-40"
                      >
                        <div className="font-bold text-zinc-900 text-[11px] mb-1 group-hover:text-emerald-600 transition-colors leading-tight">{p.nome}</div>
                        <div className="flex justify-between items-center mt-auto">
                           <div className="text-[9px] text-zinc-400 font-bold">{p.estoque} UN</div>
                           <div className="text-[10px] font-black bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md">R$ {p.preco.toFixed(2)}</div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-2xl text-white">
                    <div className="flex justify-between items-center mb-3 border-b border-white/10 pb-3">
                      <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.1em]">Total Pedido</span>
                      <span className="text-xl font-black text-emerald-400 font-mono">R$ {totalCart.toFixed(2)}</span>
                    </div>
                    {cart.length > 0 ? (
                      <button 
                        onClick={() => {
                          setCurrentMenu('PAYMENT');
                        }}
                        className="w-full py-3.5 bg-emerald-500 text-zinc-900 rounded-xl font-black text-xs hover:bg-emerald-400 transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95"
                      >
                        FINALIZAR COMPRA <ChevronRight size={16} />
                      </button>
                    ) : (
                      <div className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-center text-[9px] text-zinc-500 font-black uppercase tracking-widest">
                        AGUARDANDO ITENS
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {currentMenu === 'PAYMENT' && (
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                   <div className="flex justify-between items-center mb-6">
                      <button onClick={() => setCurrentMenu('SELECT_PRODUCTS')} className="text-[10px] font-black text-zinc-400 hover:text-zinc-600 flex items-center gap-2 uppercase tracking-widest transition-colors">
                         <ArrowLeft size={14} /> VOLTAR AO CARRINHO
                      </button>
                   </div>
                   <div className="text-center space-y-2 mb-10">
                      <h3 className="text-3xl font-black text-zinc-900">Pagamento</h3>
                      <p className="text-zinc-400 text-sm font-bold uppercase tracking-widest">Escolha o meio de transação</p>
                   </div>
                   <div className="grid grid-cols-1 gap-3">
                      {['Dinheiro', 'Cartão Crédito/Débito', 'PIX'].map(m => (
                        <button 
                          key={m}
                          onClick={() => setPaymentMethod(m)}
                          className={`w-full p-6 rounded-3xl border-2 text-left transition-all flex justify-between items-center ${paymentMethod === m ? 'border-emerald-500 bg-emerald-50 shadow-inner' : 'border-zinc-100 bg-white hover:border-zinc-300'}`}
                        >
                          <span className={`text-lg font-black ${paymentMethod === m ? 'text-emerald-900' : 'text-zinc-500'}`}>{m}</span>
                          {paymentMethod === m && (
                            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-200">
                               <div className="w-2.5 h-2.5 rounded-full bg-white" />
                            </div>
                          )}
                        </button>
                      ))}
                   </div>
                   <button 
                    onClick={finalizeSale}
                    disabled={!paymentMethod}
                    className="w-full mt-10 py-6 bg-emerald-500 text-zinc-900 rounded-3xl font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-100 disabled:opacity-20 transition-all hover:bg-emerald-400 active:scale-[0.98]"
                   >
                     Confirmar e Emitir Nota
                   </button>
                </motion.div>
              )}

              {currentMenu === 'RECEIPT' && lastSale && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-center mt-10">
                   <div className="p-10 bg-white border border-zinc-100 rounded-[40px] shadow-2xl space-y-8 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500" />
                      <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                        <FileText size={40} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-zinc-900">Venda Concluída!</h3>
                        <div className="text-[10px] text-zinc-400 font-mono font-bold mt-2 tracking-widest">SESSÃO FINALIZADA: {lastSale.id}</div>
                      </div>
                      
                      <div className="bg-zinc-50 rounded-2xl p-6 space-y-3">
                        <div className="flex justify-between text-sm items-center">
                          <span className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">Valor Recebido:</span>
                          <span className="text-xl font-black text-zinc-900 font-mono">R$ {lastSale.total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm items-center border-t border-zinc-200 pt-3">
                          <span className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">Meio Utilizado:</span>
                          <span className="text-zinc-900 font-bold">{lastSale.metodoPagamento}</span>
                        </div>
                      </div>
                   </div>
                   <button onClick={() => {
                     setCurrentMenu('MAIN');
                   }} className="text-xs font-black text-emerald-600 hover:text-emerald-700 hover:underline tracking-[0.1em] transition-all">
                     INICIAR NOVO ATENDIMENTO
                   </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="p-5 bg-zinc-100 text-[10px] text-zinc-400 font-bold flex justify-between items-center rounded-b-2xl border-t border-zinc-200">
             <div className="flex gap-4">
                <span>ESTADO: OPERACIONAL</span>
                <span>PDV: 001</span>
             </div>
             <div className="flex items-center gap-2">
                <span className="text-emerald-500">CONECTADO</span>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
             </div>
          </div>
        </section>
      </main>
    </div>
  );
}
