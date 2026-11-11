# Produto — contexto, regras e fluxos

> **[CONFIRMAR]** = premissa razoável ainda não validada com o cliente. **[PREENCHER]** = depende de informação do time.
> Valores e textos abaixo foram lidos de prints do Figma e podem ter erro de leitura. **Os valores exatos vêm do MCP do Figma**; os "números âncora" (seção 6) são o critério de conferência.

## 1. Contexto da Unect Jr.
- A Unect Jr. é uma empresa júnior universitária que desenvolve soluções de software para clientes reais.
- Diretorias envolvidas: Comercial (trouxe o lead e pediu o protótipo feito com IA, agentes e skills), Design (criou as telas no Figma), Desenvolvimento (implementa o front), Projetos e Presidência (alinhamento).
- Este protótipo **não é o produto final**: é uma prova de entendimento. Precisa parecer um sistema de verdade e contar a história do problema resolvido.

## 2. O cliente
- Uma perfumaria que compra perfumes (em lotes, a preços que variam) e revende. A marca aparece no Figma como o wordmark serifado **"perfumaria"**; o usuário logado aparece como "Cliente" (avatar "CL"). Perfumaria nome real da marca e perfil do dono(a).
- O sistema é de uso do próprio dono(a): registrar compras e vendas e enxergar lucro e estoque.

## 3. A dor principal
Hoje o controle tende a ser manual (caderno, planilha, WhatsApp). Isso gera:
1. Não saber o **lucro real** por perfume e no mês.
2. Não saber o **custo médio** quando compra o mesmo perfume a preços diferentes (o lucro "muda" a cada compra).
3. Descobrir tarde que o **estoque está acabando** de um perfume que vende bem.
4. Vender mais do que existe em estoque, ou vender abaixo do custo sem perceber.
O protótipo precisa deixar essas respostas visíveis em segundos no **Painel** e no momento de registrar cada movimentação (os resumos calculados no modal/tela de registro são o "momento uau").

## 4. Glossário
- **Produto**: um perfume, ex.: "Madeira Oriental 100ml", com família olfativa (Amadeirado, Cítrico, Floral...).
- **Compra**: entrada de unidades no estoque a um valor unitário. Recalcula o custo médio.
- **Venda**: saída de unidades do estoque a um valor unitário. Gera lucro.
- **Movimentação**: uma compra ou uma venda (aparece em "Movimentações" na web e "Histórico" no mobile).
- **Custo médio**: custo unitário médio ponderado do estoque.
- **Lucro por un.** = valor de venda − custo médio. **Margem** = lucro ÷ valor de venda.
- **Estoque baixo**: produto com estoque ≤ seu limite de aviso (padrão 3 un., configurável no cadastro).
- **Investimento / Total investido**: soma gasta em compras.

## 5. Regras de cálculo
- **Custo médio ponderado ao comprar:** `novoCusto = (estoqueAtual × custoAtual + qtdComprada × valorCompra) / (estoqueAtual + qtdComprada)`. Produto novo: custo médio = valor de compra informado.
- **Venda:** total = qtd × valor de venda; custo = qtd × custo médio **vigente no momento da venda** (guardar `custoUnitario` na movimentação, para o histórico não mudar depois); lucro = total − custo; estoque após = estoque − qtd.
- **Validação de venda:** qtd ≥ 1 e qtd ≤ estoque. Se qtd > estoque: campo em erro, mensagem de estoque insuficiente, resumo mostra "Faltam N un." em vermelho e o botão "Salvar venda" fica desabilitado. Vender todo o estoque é permitido, com aviso de que zera o estoque.
- **Validação de produto novo:** nome obrigatório; valor de venda < valor de compra mostra erro/aviso e o resumo exibe lucro e margem **negativos** (em vermelho). Resumo = lucro por un., margem e investimento inicial (qtd inicial × valor de compra).
- **Painel (mês corrente):** lucro do mês = Σ lucro das vendas do mês; total vendido = Σ total das vendas; margem média = lucro ÷ total vendido; variação vs. mês anterior = lucro do mês ÷ lucro do mês anterior − 1; em estoque = Σ estoque atual de todos os produtos; estoque baixo = nº de produtos em estoque baixo. [CONFIRMAR no Figma se "Total investido" é do mês ou acumulado; o requisito é bater os números âncora.]
- **Produtos que mais deram lucro:** ranking por lucro no mês (unidades vendidas, total vendido, lucro).
- **Desfazer venda** (toast logo após salvar): remove a movimentação e devolve as unidades ao estoque.

**Exemplo trabalhado (Madeira Oriental 100ml):** estoque 8, custo médio R$ 210,00, venda R$ 349,00. Vender 2 un.: total R$ 698,00; custo R$ 420,00; estoque após 6 un.; lucro R$ 278,00. Vender 8 un.: total R$ 2.792,00; custo R$ 1.680,00; estoque após 0; lucro R$ 1.112,00.

## 6. Números âncora (o seed precisa reproduzir)
Estado inicial do Painel ("Resumo de novembro" no Figma; no app, o mês corrente):
- Total investido **R$ 14.480,00** · Total vendido **R$ 10.438,00** · Lucro obtido **R$ 4.038,00** · Margem média **38,7%** · Em estoque **60 un.** · Estoque baixo **2 produtos** · Lucro **+13,4%** vs. mês anterior (Figma mobile: "+13,4% vs. outubro").
- Consistência: 4.038 ÷ 10.438 = 38,7%; custo das unidades vendidas = 10.438 − 4.038 = R$ 6.400,00; lucro do mês anterior = R$ 3.560,00 (gráfico "Lucro por mês"); 4.038 ÷ 3.560 − 1 = 13,4%.
- "Total investido" é do mês corrente (compras do mês); só assim os números do Figma fecham juntos.
- Últimas movimentações (Início mobile): venda de 2 un. de Cítrico Fresh 50ml hoje (R$ 318,00, +R$ 128,00) e compra de 10 un. de Lavanda Clássica 100ml ontem (R$ 1.200,00).

Após registrar a venda de 2 un. de Madeira Oriental 100ml a R$ 349,00:
- Lucro **R$ 4.316,00** · Total vendido **R$ 11.136,00** · Em estoque **58 un.** · Total investido inalterado (R$ 14.480,00).

Fatos de produtos legíveis nos prints (conferir no Figma):
| Produto | Custo | Venda | Obs. |
|---|---|---|---|
| Madeira Oriental 100ml | R$ 210,00 | R$ 349,00 | estoque 8 |
| Flor de Laranjeira 75ml | R$ 140,00 | R$ 219,00 | estoque 3 (baixo), lucro/un. R$ 79,00, margem 36,1%; no mês: 9 un., total R$ 1.971,00, lucro R$ 711,00 |
| Cítrico Fresh 50ml | R$ 95,00 | R$ 159,00 | lucro/un. R$ 64,00 |
| Âmbar Noturno 100ml | R$ 180,00 | R$ 289,00 | lucro/un. R$ 109,00 |
| Baunilha Suave 30ml | — | R$ 99,00 | estoque 2 (baixo) |
| Lavanda Clássica 100ml | R$ 120,00 | R$ 199,00 | compra recente de 10 un. a R$ 120,00 (R$ 1.200,00) |
Os 6 produtos somam 60 un. em estoque. Famílias olfativas, estoques dos demais e demais valores: ler do Figma.

## 7. Modelo de dados (`src/data/types.ts`)
- `Produto`: id, nome, familiaOlfativa, custoMedio, precoVenda, estoque, estoqueMinimo.
- `Movimentacao`: id, tipo (`'compra' | 'venda'`), produtoId, quantidade, valorUnitario, custoUnitario (só em vendas), data (ISO).
Sem `enum`: use union types. Totais, lucro, margem e estoque baixo são **seletores derivados**, não campos armazenados.

## 8. Dados mock
- Seed em `src/data/`: 6 produtos e as movimentações necessárias para reproduzir os números âncora (incluindo compras anteriores para o histórico dos 6 meses do gráfico "Lucro por mês", com valores lidos do Figma; o mês corrente deve fechar em R$ 4.038,00).
- **Datas relativas a hoje**: o Painel mostra o mês corrente e o gráfico os 6 meses até ele; no mês corrente, distribua as movimentações entre o dia 1 e hoje (se hoje for dia 1, todas caem hoje) para que os totais batam sempre. Rótulos "hoje"/"ontem" calculados.
- Sem imagens remotas. Logo "perfumaria" e ilustrações florais dos estados vazios: exportar do Figma para `public/` (SVG quando possível).

## 9. Telas e fluxos (web ↔ mobile)
| Função | Web | Mobile |
|---|---|---|
| Resumo | **Painel** (indicadores, gráfico Lucro por mês, Estoque baixo com botão "Repor", tabela Produtos que mais deram lucro, ações "Registrar compra" e "Registrar venda") | **Início** (cartão roxo com lucro do mês e margem, indicadores, "Últimas movimentações" com "Ver tudo") |
| Catálogo | **Produtos**: busca, filtros "Todos" e "Estoque baixo", tabela (estoque, valor de compra, valor de venda, lucro por un., margem), editar, "Novo produto" | **Produtos**: busca, filtros, lista de cartões, "Novo" |
| Cadastro | **Novo produto** (página com cartão "Resumo" ao lado) | equivalente mobile (ler do Figma) |
| Detalhe | (editar pela tabela) | **Detalhe do produto**: alerta de estoque baixo, valor de compra/venda, lucro por un., margem, bloco "No mês", botões Compra/Venda |
| Registrar | **Movimentações** → modal "Registrar movimentação" com abas Compra/Venda | tela **Registrar** (abas Compra/Venda, seletor de quantidade com −/+), acessada pelo botão central da barra inferior |
| Histórico | **Movimentações**: tabela (data, tipo, produto, qtd, valor un., total, lucro) | **Histórico** |

Fluxos principais:
1. **Registrar venda:** escolher produto (mostra "N em estoque · compra a R$ X") → quantidade → valor un. (pré-preenchido com o preço de venda) → data. Resumo ao vivo: total da venda, custo (custo médio × qtd), estoque após, **lucro da venda**. Salvar → estoque cai, movimentação entra no topo da lista com destaque temporário, Painel e gráfico atualizam, toast "Venda registrada" com ação (Desfazer / Ver venda).
2. **Registrar compra:** produto → quantidade → valor de compra un. → data. Resumo: total da compra, estoque após, **custo médio** (antes → depois) e **lucro por un. a partir de agora**, com nota explicando que o custo médio foi recalculado. Salvar → estoque sobe, custo médio muda, total investido sobe.
3. **Novo produto:** nome, família olfativa, valor de compra, valor de venda, quantidade inicial, aviso de estoque baixo → resumo (lucro por un., margem, investimento inicial). Salvar → produto entra na lista (a compra inicial entra no total investido).
4. **Repor** (Painel, produto em estoque baixo): abre o registro de compra com o produto pré-selecionado.
5. **Busca em Produtos:** filtra por nome (sem diferenciar acentos). Sem resultado: estado "Nenhum produto encontrado para '…'" com botão "Limpar busca". Sem produtos: estado vazio com botão "Cadastrar primeiro produto".
Jornada de demonstração ideal (3 min): Painel mostra estoque baixo → "Repor" → compra recalcula custo médio → registrar uma venda (resumo de lucro ao vivo) → toast → Painel e gráfico atualizados → tentativa de vender acima do estoque mostra o bloqueio.

## 10. Fora de escopo
Autenticação real, backend/API, múltiplos usuários, emissão de nota, relatórios exportáveis, integração com pagamento, testes automatizados.