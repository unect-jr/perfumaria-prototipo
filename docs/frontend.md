# Frontend — qualidade, fidelidade e animações

## 1. Fidelidade ao Figma
- O MCP do Figma é a fonte da verdade: estrutura, **textos exatos**, valores, estados. **Não use screenshots nem leia imagens** (nem PNGs em `design/`, se existirem): quem confere o visual é o Nuno.
- **Etapa de fundação (antes das telas):** extrair do Figma cores, tipografia, raios, sombras e espaçamentos e declarar em `src/index.css` com `@theme`. Todas as telas usam esses tokens; proibido valor "mágico" repetido nos componentes. Se uma fonte do Figma vier do Google Fonts, carregar no `index.html`.
- Se o Figma e a skill `frontend-design` divergirem, **vence o Figma**: a skill orienta qualidade e acabamento, não troca a identidade do cliente.
- Linguagem visual observada: fundo off-white/creme, cartões brancos com cantos arredondados, **violeta/roxo profundo** como cor primária (botões, cartão de destaque do mobile, aba ativa), lavanda clara no gráfico, **verde** para lucro positivo, **laranja/âmbar** para estoque baixo, **vermelho** para erro e valores negativos; wordmark serifado "perfumaria"; ilustrações florais em traço fino nos estados vazios.
- Quando faltar algo no Figma (hover, foco, loading), derive dos tokens existentes mantendo o tom.

## 2. Estrutura
```
src/
  components/   ui/ (Button, Badge, Card, Modal, Field, Select, Stepper, Toast, EmptyState...) e domínio (KpiCard, ProductRow, MovementRow, ProfitBars...)
  pages/        Painel, Produtos, ProdutoNovo, ProdutoDetalhe, Movimentacoes, Registrar
  layouts/      AppLayout (sidebar no web, barra inferior no mobile)
  store/        Context + useReducer, ações e seletores (derivados)
  data/         types.ts, seed.ts
  lib/          format.ts (moeda, datas relativas), calc.ts (custo médio, lucro, margem)
```
Componentes pequenos e tipados. Um componente por arquivo. Reaproveitar antes de criar. **Funções de cálculo ficam em `lib/calc.ts`**, puras e sem React.

## 3. Web + mobile no mesmo app
- Breakpoint principal em `md` (≈ 768 px): abaixo dele, layout mobile do Figma (barra inferior com Início, Produtos, Histórico e o botão central "Registrar"); a partir dele, layout web (sidebar com Painel, Produtos, Movimentações).
- Mesmas rotas e mesmo store. Onde o design difere, troque o **componente de apresentação**, nunca a lógica.
- O formulário de registrar movimentação é um só: **modal** no web e **tela cheia** (`/registrar`) no mobile.
- "Início" (mobile) e "Painel" (web) são a mesma rota; "Histórico" e "Movimentações" também.

## 4. Ordem de implementação (um commit por marco)
1. Tokens + layout (sidebar/barra inferior, cabeçalho, avatar "CL") + rotas.
2. Componentes base: Button, Badge (Compra/Venda, Estoque baixo), Card, Field, Select, Modal, Stepper, Toast, EmptyState.
3. `data/types.ts`, `lib/calc.ts`, `lib/format.ts`, store e seed que reproduz os **números âncora** de `docs/produto.md`.
4. Painel / Início (indicadores, gráfico em SVG/divs, estoque baixo, ranking).
5. Produtos (lista, busca, filtros, estados vazio e sem resultado) + Detalhe do produto (mobile).
6. Novo produto (validações e cartão de resumo).
7. Registrar movimentação (modal e tela): abas Compra/Venda, resumos ao vivo, validação de estoque, toast com Desfazer.
8. Movimentações / Histórico (tabela e lista) com destaque da movimentação recém-criada.
9. Polimento: animações, responsividade, acessibilidade, estados de erro.
10. Deploy na Vercel.

## 5. Animações (biblioteca `motion`, `import { motion } from "motion/react"`)
Objetivo: sensação profissional e viva **sem alterar o layout do Figma**. Só `motion`; **não** usar GSAP, Lenis nem 3D.
- Transição entre páginas: fade + leve deslocamento vertical (≈ 8–12 px), 200–300 ms.
- Indicadores do Painel: contagem animada dos números ao entrar e quando mudam após uma venda/compra.
- Gráfico "Lucro por mês": barras crescem de baixo para cima em cascata; a barra do mês corrente anima quando o lucro muda.
- Modal: overlay com fade, painel com escala sutil (0.96 → 1), saída animada (`AnimatePresence`).
- Resumos calculados (total, lucro, estoque após): transição suave dos números enquanto o usuário digita; o lucro pode pulsar levemente ao mudar de sinal.
- Nova movimentação: linha entra no topo com destaque que esmaece em ~2 s; toast entra deslizando e sai sozinho.
- Listas: entrada em cascata (30–50 ms por item). Botões: `whileTap` escala 0.97; cartões com hover sutil no web.
- Easing suave (ex.: `[0.22, 1, 0.36, 1]`), durações entre 150 e 400 ms. Nada que bloqueie o uso.
- Respeitar `prefers-reduced-motion`: envolver o app em `<MotionConfig reducedMotion="user">`. Animar só `transform` e `opacity` quando possível.

## 6. Qualidade e acabamento
- Estados completos: vazio, busca sem resultado, validação inline, loading curto simulado quando fizer sentido, sucesso (toast) e erro.
- Formulários com validação visível e mensagens exatamente como no Figma; foco gerenciado nos modais; Enter envia, Esc fecha.
- Números e moeda com `tabular-nums`; valores negativos em vermelho; lucro positivo em verde.
- Acessibilidade: elementos semânticos, `button` de verdade, `aria-label` em ícones, foco visível, contraste suficiente, modais com `role="dialog"`, abas com `role="tablist"`.
- Sem erros ou avisos no console. Sem dependências não aprovadas.

## 7. Deploy (Vercel)
- App estático (SPA). Criar `vercel.json` para o React Router funcionar ao recarregar a página:
  `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }`
- Build: `npm run build`, saída `dist/`, framework "Vite". Conectar o repositório do GitHub e fazer deploy a cada `push` na `main`.
- Antes do deploy: `npm run build` e `npm run lint` sem erros. Ajustar `<title>` e `lang="pt-BR"` no `index.html`.

## 8. Checklist de pronto (por tela)
- [ ] Textos e valores vêm do Figma (via MCP), não de memória.
- [ ] Usa só tokens do `@theme`.
- [ ] Números calculados a partir das movimentações; batem com os âncoras.
- [ ] Estados vazio/validação/erro tratados; web e mobile cobertos.
- [ ] Animações aplicadas e respeitando reduced motion.
- [ ] Teclado e leitor de tela razoáveis.
- [ ] `npm run build` passa. (Conferência visual: Nuno.)