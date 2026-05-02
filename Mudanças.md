# Mudanças feitas por Heitor Delfino

---

## [008] Correções no TCC — Folha de Aprovação e referências verificadas

**Arquivo alterado:**
- `TCC/BudgetGenerator_TCC_Novo.md`

**O que foi feito:**
- Adicionada **Folha de Aprovação** (obrigatória em TCCs FATEC) com campos para data da defesa, assinatura do orientador e dois examinadores
- Corrigida referência de **Machado (2023)**:
  - Autor real: Alexandre de Oliveira Bittencourt Machado
  - Título real: *A Inteligência Artificial Generativa Como Novo Agente Disruptor de Mercado*
  - Instituição: UFBA — Faculdade de Economia
  - URL verificada: `repositorio.ufba.br/bitstream/ri/39246/1/...`
- Corrigida referência de **Silva e Brickes (2018)**:
  - Autores reais: Gabriel Chittolina Silva e Renan Brickes
  - Título real: *Desenvolvimento de Sistema para Auxílio de Orçamento*
  - Instituição: FATEC Americana — Centro Paula Souza
  - URL verificada: `ric.cps.sp.gov.br/bitstream/123456789/3183/...`
- Atualizado corpo do texto (seção 2.8) para descrever corretamente os dois trabalhos relacionados

**É necessário fazer algo para rodar?**
Não. Alterações apenas na documentação do TCC.

---

## [007] Documentação TCC — documento completo e diagramas PlantUML

**Arquivos criados:**
- `TCC/BudgetGenerator_TCC_Novo.md`
- `TCC/Diagramas_PlantUML.md`

**O que foi feito:**
- Criado TCC completo em Markdown, estrutura ABNT, foco em ADS, atualizando o documento original para refletir a stack real do projeto (Angular 19, TypeScript, Prisma, Clean Architecture, Google Gemini):
  - Capa, folha de rosto, agradecimentos, epígrafe
  - Resumo (pt-BR) e Abstract (inglês)
  - Lista de Figuras, Tabelas e Abreviaturas
  - Sumário
  - 6 capítulos completos com conteúdo acadêmico real
  - 21 referências bibliográficas
  - Apêndice A (endpoints da API) e Apêndice B (roteiro de testes)
  - 15 espaços marcados para figuras (padrão ABNT)
- Criado arquivo de diagramas PlantUML com 10 diagramas prontos para gerar imagem:
  - Diagrama ER (banco de dados)
  - Diagrama de Classes — Domínio
  - Diagrama de Classes — Camada de Aplicação
  - Diagrama de Caso de Uso
  - Diagrama de Sequência — Autenticação
  - Diagrama de Sequência — Geração de Orçamento (3 etapas com retry)
  - Diagrama de Sequência — Edição de Orçamento
  - Diagrama de Componentes (Clean Architecture por camada)
  - Diagrama de Implantação (Docker, Node.js, Angular, serviços externos)
  - Diagrama de Atividades (fluxo completo de geração com swimlanes)

**Como usar os diagramas:**
Copiar cada bloco de código do arquivo e colar em https://www.plantuml.com/plantuml/uml/ para gerar a imagem.

**É necessário fazer algo para rodar?**
Não. Arquivos apenas de documentação.

---

## [006] Guia de ambiente para colaboradores

**Arquivo criado:**
- `AMBIENTE_COLABORADOR.md` (raiz do projeto)

**O que foi feito:**
- Criado documento de instrução para a IA do colaborador ler ao fazer o merge da branch `heitor/desenvolvimento`
- Lista todas as mudanças de ambiente: porta do Docker, schema do banco, dependências novas, imagem adicionada
- Inclui diagnóstico rápido em tabela, checklist pós-merge ordenado e tabela de erros comuns com soluções
- Esclarece o que NÃO precisa mudar (credenciais, JWT, estrutura geral)

**É necessário fazer algo para rodar?**
Não. Arquivo apenas de documentação.

---

## [005] Nome do cliente e do prestador no orçamento e PDF

**Arquivos alterados (backend):**
- `prisma/schema.prisma` (campos `cliente_nome` e `prestador_nome` adicionados ao Budget)
- `src/domain/entities/Budget.ts`
- `src/infrastructure/database/prisma/PrismaBudgetRepository.ts`
- `src/application/use-cases/GenerateBudgetUseCase.ts`
- `src/presentation/controllers/BudgetController.ts`

**Arquivos alterados (frontend):**
- `frontend/src/app/core/models/budget.model.ts`
- `frontend/src/app/core/services/budget.service.ts`
- `frontend/src/app/features/landing-page/landing-page.component.html`
- `frontend/src/app/features/landing-page/landing-page.component.ts`
- `frontend/src/app/features/landing-page/landing-page.component.css`

**O que foi feito:**
- Adicionados dois novos campos no formulário de geração de orçamento:
  - **Nome do cliente** (opcional): aparece em cima da linha de assinatura do cliente no PDF, em letras maiúsculas
  - **Seu nome na proposta**: pré-preenchido automaticamente com o nome do perfil do usuário logado; pode ser alterado a qualquer momento
- Ambos os nomes são salvos no banco de dados junto ao orçamento
- No PDF: se o nome do cliente estiver preenchido, aparece em negrito e maiúsculas acima da linha de assinatura; o nome do prestador sempre aparece acima da linha do prestador

**É necessário fazer algo para rodar?**
Sim — rodar o `prisma db push` para aplicar os novos campos no banco:
```bash
npx prisma db push
```
(já executado — necessário apenas se for clonar do zero)

---

## [004] Correções no PDF do orçamento

**Arquivo alterado:**
- `frontend/src/app/features/landing-page/landing-page.component.ts`

**O que foi feito:**
- Removido o rodapé "Este documento foi gerado automaticamente por IA." do PDF
- Adicionada seção de **Garantia** antes das assinaturas
- Adicionadas as linhas de assinatura com "Nome / Data" abaixo de cada uma: **Assinatura do Cliente** e **Assinatura do Prestador**
- O bloco de assinaturas verifica automaticamente se cabe na página atual; se não couber, abre uma nova página antes de desenhar

**É necessário fazer algo para rodar?**
Não. Alteração apenas no frontend.

---

## [001] Ajuste de conteúdo da Landing Page

**Arquivos alterados:**
- `frontend/src/app/features/landing-page/landing-page.component.html`
- `frontend/src/app/features/landing-page/landing-page.component.ts`

**O que foi feito:**
Textos da seção pública (hero, cards de serviços e CTA) foram refinados para comunicar com mais precisão o propósito da ferramenta — geração de propostas técnicas para projetos de clientes — sem alterar o layout ou o design da página.

Mudanças específicas:
- **Hero (descrição):** de uma frase genérica sobre "necessidades técnicas" para uma que posiciona o usuário como prestador de serviço que entrega propostas ao cliente.
- **Subtítulo de Serviços:** texto atualizado para refletir o ciclo completo de um projeto técnico (requisitos → orçamento).
- **Card Upgrade:** foco em melhoria de infraestrutura de sistemas, detalhada por item.
- **Card Reparo:** ênfase em peças, mão de obra e prazos — estrutura de orçamento técnico real.
- **Card Manutenção:** reposicionado para geração de contratos e planos preventivos voltados ao cliente.
- **CTA:** de "otimizar orçamentos" para "profissionalizar propostas técnicas".

**É necessário fazer algo para rodar?**
Não. As alterações são apenas de texto no frontend. Basta ter o projeto rodando normalmente (`npm start` dentro de `frontend/`).

---

## [002] Reposicionamento da seção "Nossos Serviços"

**Arquivos alterados:**
- `frontend/src/app/features/landing-page/landing-page.component.html`
- `frontend/src/app/features/landing-page/landing-page.component.ts`

**O que foi feito:**
A seção foi reposicionada de "venda de serviços" para "demonstração de valor da ferramenta". O título, subtítulo e os 3 cards agora comunicam o que o usuário *consegue gerar* com o software, não serviços prestados pela equipe.

Mudanças específicas:
- **Título da seção:** "Nossos Serviços" → "O que você pode gerar?"
- **Subtítulo:** Reescrito para destacar que a IA monta o orçamento pelo usuário, com valores de mercado e pronto para apresentar ao cliente.
- **Card Upgrade:** Foco no ganho do usuário — descreve e recebe o orçamento pronto, sem pesquisar manualmente.
- **Card Reparo:** IA identifica serviços, gera lista de itens com valores e entrega proposta pronta para aprovação.
- **Card Manutenção:** Proposta preventiva completa gerada a partir da descrição do ambiente do cliente.

**É necessário fazer algo para rodar?**
Não. Alterações apenas de texto no frontend.

---

## [003] Pesquisa de preços reais + toggle de detalhamento de peças

**Arquivos criados:**
- `src/infrastructure/external-services/PriceResearchService.ts`

**Arquivos alterados (backend):**
- `src/domain/interfaces/IBudgetGenerator.ts`
- `src/infrastructure/external-services/GeminiBudgetService.ts`
- `src/application/use-cases/GenerateBudgetUseCase.ts`
- `src/presentation/controllers/BudgetController.ts`
- `src/main/routes.ts`
- `package.json` (axios + cheerio instalados)

**Arquivos alterados (frontend):**
- `frontend/src/app/features/landing-page/landing-page.component.html`
- `frontend/src/app/features/landing-page/landing-page.component.ts`
- `frontend/src/app/features/landing-page/landing-page.component.css`
- `frontend/src/app/core/services/budget.service.ts`

**O que foi feito:**

O fluxo de geração de orçamento agora tem 3 etapas:

1. **Análise (Gemini):** A IA interpreta a descrição do cliente e decide automaticamente se o serviço exige compra de peças físicas. Considera casos como "já comprado pelo cliente" ou serviços puramente de mão de obra.

2. **Pesquisa de preços (backend):** Se precisar de peças, o backend pesquisa em paralelo nos sites:
   - Mercado Livre (API oficial gratuita)
   - KaBuM, Pichau, TerabyteShop (scraping com Cheerio)
   Pega os 3 menores preços encontrados e calcula a média real de mercado.

3. **Geração (Gemini):** A IA recebe os preços pesquisados como contexto e gera o orçamento com valores reais de mercado.

**Toggle "Detalhar custo de peças":**
- **Ativado:** peças e mão de obra aparecem como itens separados no orçamento, com preços de mercado por item.
- **Desativado:** valores consolidados em descrição genérica, sem expor custo individual das peças.

**É necessário fazer algo para rodar?**

Sim — reinstalar as dependências do backend pois `axios` e `cheerio` foram adicionados:
```bash
npm install
```
(dentro da pasta raiz do projeto, onde está o `package.json` do backend)

O banco de dados e o frontend não precisam de nenhuma alteração.
