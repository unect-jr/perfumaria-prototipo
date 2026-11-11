# CLAUDE.md — Protótipo Perfumaria (compras, vendas e estoque com lucro automático)

Protótipo **somente front-end**, com dados mockados, feito pela **Unect Jr.** (empresa júnior universitária)
para apresentar ao lead/cliente (uma perfumaria) na reunião de alinhamento. Será publicado na **Vercel**.
Objetivo: mostrar, com fluxo completo, navegável e acabamento profissional fiel ao Figma, como o cliente passa a saber
seu **lucro real, custo médio e estoque** sem planilha.

## Leia sob demanda (NÃO leia tudo toda vez)
- `docs/produto.md` — contexto do negócio, glossário, fórmulas, números âncora do Figma, dados mock e fluxos. Leia antes de implementar lógica, store, seed ou fluxo.
- `docs/frontend.md` — fidelidade ao Figma, tokens, web + mobile, componentes, animações, acessibilidade, deploy. Leia antes de implementar UI.

## Comandos
- `npm run dev` — servidor Vite com HMR
- `npm run build` — `tsc -b` + build de produção em `dist/`
- `npm run lint` — ESLint
- `npm run preview` — serve o `dist/`
Sem test runner. Valide cada etapa com `npm run build`.

## Stack e armadilhas
- React 19 + TypeScript + Vite + `@vitejs/plugin-react`.
- Tailwind CSS v4 via `@tailwindcss/vite`. Não existe `tailwind.config.js`: tokens ficam em `src/index.css` com `@theme`.
- TypeScript estrito: sem locals/params não usados, `verbatimModuleSyntax` (use `import type`), `erasableSyntaxOnly` (sem `enum`, sem parameter properties, sem namespaces).
- Dependências permitidas além do template: `react-router`, `motion`. O gráfico "Lucro por mês" é feito à mão (SVG/divs), **sem biblioteca de gráficos**. Qualquer outra dependência: pergunte antes.
- `src/App.css` e `src/assets/*` do template não são usados; remova quando for conveniente.

## Regras inegociáveis
1. **Figma é a fonte da verdade** (via MCP): estrutura, textos exatos, cores, tipografia, espaçamentos. Nunca invente o que existe no Figma.
2. Todo texto em **pt-BR**; moeda `R$ 1.234,56` e datas via `Intl`.
3. **Sem backend**. Estado em memória (Context + useReducer) com seed em `src/data/`; `localStorage` é opcional, com try/catch.
4. **Um app, dois layouts**: web (sidebar) e mobile (barra inferior), com o mesmo store e os mesmos componentes de domínio. Nada de duplicar lógica.
5. **Os números do Figma precisam bater** com o que o app calcula (veja "números âncora" em `docs/produto.md`). Totais, lucro, margem e estoque são sempre **calculados a partir das movimentações**, nunca digitados na tela.
6. Telas conectadas pelo mesmo estado: registrar compra ou venda atualiza Painel, Produtos, Movimentações e o gráfico.
7. Estados de **vazio, busca sem resultado, validação e erro** fazem parte do escopo (estão no Figma).
8. Código em inglês, nomes de domínio em português (`Produto`, `Movimentacao`), comentários em português, sem `any`.

## Fluxo de trabalho com o Figma (por tela)
1. Receber o link do frame. Buscar o contexto de design **desse frame** pelo MCP do Figma (um frame por vez, nunca o arquivo inteiro). Textos, valores e estados vêm de lá.
2. Antes de codar algo grande, mostrar plano curto: componentes novos, reaproveitados, rota e dados. Esperar OK.
3. Implementar; reaproveitar componentes de `src/components/`.
4. Validar com `npm run build` (e `npm run lint` ao fim). **O Nuno confere o visual no navegador.**
5. Responder só com a lista de arquivos criados/alterados e pendências.

## Economia de tokens
- **Nunca tire screenshots nem leia imagens** para conferir o visual: nada de prints do navegador, Playwright, extensão do Chrome ou leitura de PNG/JPG (inclusive `design/`). Use o MCP do Figma (estrutura e texto) e a revisão do código. A conferência visual é do Nuno.
- Uma tela ou tarefa por sessão. Sugira `/clear` quando terminar.
- Não leia `node_modules/`, `dist/`, lockfiles nem arquivos grandes sem necessidade. Prefira Glob/Grep a ler arquivos inteiros.
- Não reescreva arquivos grandes para mudanças pequenas: edite só o trecho.
- Não crie documentação, testes ou arquivos extras que não foram pedidos.
- Não suba o dev server nem abra o navegador para "ver" o resultado.
- Respostas curtas; não repita o que já está nos docs.

## Git
Commits em português, conventional commits (`feat:`, `fix:`, `chore:`, `refactor:`), um commit por tela ou marco.