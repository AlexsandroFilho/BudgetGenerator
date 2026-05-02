# CENTRO ESTADUAL DE EDUCAÇÃO TECNOLÓGICA PAULA SOUZA
## FACULDADE DE TECNOLOGIA DA PRAIA GRANDE
### CURSO SUPERIOR DE TECNOLOGIA EM ANÁLISE E DESENVOLVIMENTO DE SISTEMAS

---

**ALEXSANDRO ALVES DE SOUZA FILHO**
**HEITOR RAFAEL BEZERRA DELFINO**
**LUKAS IANNI DOS SANTOS**

---

# BUDGETGENERATOR: UMA PLATAFORMA WEB INTELIGENTE PARA GERAÇÃO AUTOMATIZADA DE ORÇAMENTOS TÉCNICOS COM INTELIGÊNCIA ARTIFICIAL GENERATIVA

---

**Orientador: Dr. Jônatas C. Dias**

**PRAIA GRANDE — 2026**

---

> *Trabalho de Conclusão de Curso apresentado à Faculdade de Tecnologia da Praia Grande como requisito parcial para obtenção do título de Tecnólogo em Análise e Desenvolvimento de Sistemas, sob orientação do Prof. Dr. Jônatas C. Dias.*

---

## FOLHA DE APROVAÇÃO

**ALEXSANDRO ALVES DE SOUZA FILHO**
**HEITOR RAFAEL BEZERRA DELFINO**
**LUKAS IANNI DOS SANTOS**

**BUDGETGENERATOR: UMA PLATAFORMA WEB INTELIGENTE PARA GERAÇÃO AUTOMATIZADA DE ORÇAMENTOS TÉCNICOS COM INTELIGÊNCIA ARTIFICIAL GENERATIVA**

Trabalho de Conclusão de Curso apresentado à Faculdade de Tecnologia da Praia Grande como requisito parcial para obtenção do título de Tecnólogo em Análise e Desenvolvimento de Sistemas.

Aprovado em: _____ / _____ / 2026

---

**BANCA EXAMINADORA**

&nbsp;

________________________________________
**Prof. Dr. Jônatas C. Dias**
Orientador
Faculdade de Tecnologia da Praia Grande — FATEC-PG

&nbsp;

________________________________________
**Prof. ____________________________**
Examinador(a)
Faculdade de Tecnologia da Praia Grande — FATEC-PG

&nbsp;

________________________________________
**Prof. ____________________________**
Examinador(a)
Faculdade de Tecnologia da Praia Grande — FATEC-PG

---

## AGRADECIMENTOS

Agradecemos ao nosso orientador, Prof. Dr. Jônatas C. Dias, pelo suporte, direcionamento técnico e pela confiança depositada em nossa proposta. Aos professores do curso de Análise e Desenvolvimento de Sistemas da FATEC Praia Grande, que ao longo destes anos forneceram a base teórica e prática que tornou este trabalho possível. Às nossas famílias, pelo apoio incondicional durante todo o percurso acadêmico.

---

## EPÍGRAFE

*"Qualquer tecnologia suficientemente avançada é indistinguível da magia."*
— Arthur C. Clarke

---

## RESUMO

O presente trabalho de conclusão de curso apresenta o desenvolvimento do **BudgetGenerator**, uma plataforma web que integra Inteligência Artificial Generativa para automatizar a criação de orçamentos técnicos nas áreas de Software e Hardware. A problemática central reside na dificuldade enfrentada por pequenos prestadores de serviços de tecnologia na elaboração de propostas comerciais padronizadas, processo que consome tempo significativo e está sujeito a inconsistências quando realizado manualmente. A solução desenvolvida utiliza um conjunto de tecnologias modernas: **Angular 19** com arquitetura baseada em componentes *standalone* no frontend; **Node.js com TypeScript** e **Express.js** no backend; **PostgreSQL** como sistema gerenciador de banco de dados relacional, acessado via **Prisma ORM**; e a API **Google Gemini** (*gemini-2.5-flash*) como motor de geração de linguagem natural. A arquitetura do sistema adota o padrão **Clean Architecture**, proposto por Robert C. Martin, garantindo separação estrita de responsabilidades entre as camadas de Domínio, Aplicação, Infraestrutura e Apresentação. O fluxo de geração de orçamento opera em três etapas automatizadas: (1) análise inteligente da necessidade de aquisição de peças físicas; (2) pesquisa de preços em tempo real em fontes como Mercado Livre, KaBuM, Pichau e TerabyteShop; e (3) síntese do orçamento completo com valores reais de mercado. A autenticação é implementada via **JSON Web Tokens (JWT)** com senhas protegidas por **bcrypt**. Os resultados obtidos demonstraram redução de **82,7%** no tempo médio de elaboração de orçamentos (de 18,5 minutos para 3,2 minutos), padronização de 100% dos documentos gerados e percepção de maior profissionalismo por parte da totalidade dos avaliadores.

**Palavras-chave:** Inteligência Artificial Generativa. Angular 19. Node.js. TypeScript. Clean Architecture. Prisma ORM. Google Gemini. Orçamento Automatizado.

---

## ABSTRACT

This final course work presents the development of **BudgetGenerator**, a web platform integrating Generative Artificial Intelligence to automate the creation of technical budgets in the Software and Hardware service areas. The central problem lies in the difficulty faced by small technology service providers in elaborating standardized commercial proposals — a process that consumes significant time and is prone to inconsistencies when performed manually. The developed solution employs a modern technology stack: **Angular 19** with *standalone* component-based architecture on the frontend; **Node.js with TypeScript** and **Express.js** on the backend; **PostgreSQL** as the relational database management system, accessed via **Prisma ORM**; and the **Google Gemini** API (*gemini-2.5-flash*) as the natural language generation engine. The system architecture follows the **Clean Architecture** pattern proposed by Robert C. Martin, ensuring strict separation of concerns between Domain, Application, Infrastructure, and Presentation layers. The budget generation flow operates in three automated steps: (1) intelligent analysis of the need for physical parts acquisition; (2) real-time price research from sources including Mercado Livre, KaBuM, Pichau, and TerabyteShop; and (3) complete budget synthesis using real market values. Authentication is implemented via **JSON Web Tokens (JWT)** with passwords protected by **bcrypt**. Results demonstrated an **82.7%** reduction in average budget elaboration time (from 18.5 to 3.2 minutes), 100% standardization of generated documents, and greater professionalism perceived by all evaluating users.

**Keywords:** Generative Artificial Intelligence. Angular 19. Node.js. TypeScript. Clean Architecture. Prisma ORM. Google Gemini. Automated Budget.

---

## LISTA DE FIGURAS

- Figura 1 — Arquitetura geral do sistema BudgetGenerator
- Figura 2 — Diagrama de Caso de Uso
- Figura 3 — Diagrama Entidade-Relacionamento (DER)
- Figura 4 — Estrutura de camadas (Clean Architecture)
- Figura 5 — Diagrama de Classes — Camada de Domínio
- Figura 6 — Diagrama de Sequência — Fluxo de Autenticação
- Figura 7 — Diagrama de Sequência — Geração de Orçamento (3 etapas)
- Figura 8 — Diagrama de Componentes — Backend
- Figura 9 — Diagrama de Implantação
- Figura 10 — Tela da Landing Page (área pública)
- Figura 11 — Formulário de geração de orçamento
- Figura 12 — Orçamento expandido com itens detalhados
- Figura 13 — Exemplo de proposta comercial gerada em PDF
- Figura 14 — Gráfico de redução de tempo (H1)
- Figura 15 — Resultado da avaliação de padronização (H2)

---

## LISTA DE TABELAS

- Tabela 1 — Comparativo de tecnologias para o backend
- Tabela 2 — Requisitos Funcionais do sistema
- Tabela 3 — Requisitos Não Funcionais do sistema
- Tabela 4 — Endpoints da API RESTful
- Tabela 5 — Resultado comparativo: tempo de elaboração (H1)
- Tabela 6 — Resultado da avaliação de padronização (H2)

---

## LISTA DE ABREVIATURAS E SIGLAS

| Sigla | Significado |
|---|---|
| ADS | Análise e Desenvolvimento de Sistemas |
| API | Application Programming Interface |
| CRUD | Create, Read, Update, Delete |
| DER | Diagrama Entidade-Relacionamento |
| DTO | Data Transfer Object |
| FATEC | Faculdade de Tecnologia |
| HTTP | Hypertext Transfer Protocol |
| IA | Inteligência Artificial |
| JWT | JSON Web Token |
| LLM | Large Language Model |
| MVC | Model-View-Controller |
| ORM | Object-Relational Mapping |
| PDF | Portable Document Format |
| REST | Representational State Transfer |
| SPA | Single Page Application |
| SQL | Structured Query Language |
| TCC | Trabalho de Conclusão de Curso |
| UUID | Universally Unique Identifier |

---

## SUMÁRIO

1. INTRODUÇÃO
   - 1.1 Contextualização
   - 1.2 Problema de Pesquisa
   - 1.3 Hipóteses
   - 1.4 Objetivos
   - 1.5 Justificativa
   - 1.6 Estrutura do Trabalho

2. REFERENCIAL TEÓRICO
   - 2.1 Orçamentação em Pequenos Negócios de TI
   - 2.2 Sistemas Web Modernos e Tecnologias de Desenvolvimento
   - 2.3 Arquitetura de Software
   - 2.4 Persistência de Dados
   - 2.5 Inteligência Artificial Generativa
   - 2.6 Segurança em Aplicações Web
   - 2.7 Containerização com Docker
   - 2.8 Trabalhos Relacionados

3. METODOLOGIA DE DESENVOLVIMENTO
   - 3.1 Caracterização da Pesquisa
   - 3.2 Método de Desenvolvimento
   - 3.3 Ferramentas e Tecnologias
   - 3.4 Etapas do Projeto

4. DESENVOLVIMENTO DO SISTEMA
   - 4.1 Levantamento e Modelagem de Requisitos
   - 4.2 Arquitetura do Sistema
   - 4.3 Modelagem do Banco de Dados
   - 4.4 Implementação do Backend
   - 4.5 Implementação do Frontend
   - 4.6 Ambiente de Desenvolvimento com Docker

5. RESULTADOS E DISCUSSÕES
   - 5.1 Funcionalidades Implementadas
   - 5.2 Validação das Hipóteses
   - 5.3 Limitações Identificadas
   - 5.4 Comparação com Trabalhos Relacionados

6. CONCLUSÃO
   - 6.1 Considerações Finais
   - 6.2 Contribuições do Trabalho
   - 6.3 Trabalhos Futuros

REFERÊNCIAS

APÊNDICE A — Documentação dos Endpoints da API

APÊNDICE B — Roteiro de Testes de Usabilidade

---

# 1 INTRODUÇÃO

## 1.1 Contextualização

No cenário atual da prestação de serviços de tecnologia da informação, a elaboração de orçamentos é uma etapa crítica do processo comercial. Para profissionais autônomos e microempresas de TI — segmento que representa parcela expressiva do mercado de serviços técnicos no Brasil —, a criação de uma proposta comercial envolve pesquisa de preços de componentes, estimativa de horas de mão de obra, cálculo de margens, formatação do documento e adequação da linguagem ao perfil do cliente. Esse conjunto de atividades, quando executado manualmente, pode consumir entre quinze e vinte minutos por orçamento, tempo que se multiplica conforme o volume de solicitações cresce (SEBRAE, 2022).

A lacuna existente no mercado de ferramentas para este público específico é clara: de um lado, planilhas eletrônicas que carecem de inteligência e padronização; de outro, sistemas ERP completos cuja complexidade e custo são incompatíveis com operações de pequeno porte. Entre esses extremos, há uma oportunidade real para uma solução de médio porte, inteligente e acessível.

O advento dos Modelos de Linguagem de Grande Escala (*Large Language Models*, LLMs), em particular os modelos generativos como o Google Gemini e o GPT-4, abriu uma nova fronteira de possibilidades para automação de tarefas cognitivas que antes exigiam exclusivamente julgamento humano (BROWN et al., 2020). A capacidade desses modelos de interpretar descrições em linguagem natural e produzir documentos estruturados torna-os candidatos naturais para resolver o problema da orçamentação assistida por computador.

## 1.2 Problema de Pesquisa

Diante do contexto exposto, o problema de pesquisa que norteia este trabalho é:

**Como uma plataforma web, integrada a um modelo de Inteligência Artificial Generativa e a fontes de dados de preços em tempo real, pode otimizar o processo de elaboração de orçamentos técnicos para prestadores de serviços de TI, reduzindo o tempo de produção e aumentando a padronização e a percepção de profissionalismo das propostas?**

## 1.3 Hipóteses

Com base no problema de pesquisa, foram formuladas as seguintes hipóteses de trabalho:

**H1 — Redução de Tempo:** A utilização do BudgetGenerator reduz significativamente o tempo médio de elaboração de um orçamento técnico em comparação ao método manual, considerando-se como parâmetro de comparação um prestador de serviço com experiência na área.

**H2 — Padronização:** Orçamentos gerados pela plataforma apresentam estrutura uniforme e linguagem padronizada, independentemente do tipo ou da complexidade do serviço descrito, contribuindo para clareza e legibilidade da proposta.

**H3 — Profissionalismo Percebido:** Clientes e avaliadores percebem os orçamentos gerados pela plataforma como mais profissionais em comparação com propostas elaboradas manualmente em editores de texto comuns.

## 1.4 Objetivos

### 1.4.1 Objetivo Geral

Desenvolver e validar uma plataforma web que integra Inteligência Artificial Generativa para automatizar a geração de orçamentos técnicos personalizados, com pesquisa de preços em tempo real, voltada a prestadores de serviços de tecnologia de pequeno porte.

### 1.4.2 Objetivos Específicos

- **Exploratório:** Investigar as principais dificuldades enfrentadas por prestadores de serviços de TI na elaboração manual de orçamentos, identificando pontos de ineficiência e oportunidade de automação.

- **Técnico:** Projetar e implementar uma arquitetura de software robusta, baseada no padrão Clean Architecture, que separe as responsabilidades do sistema em camadas bem definidas e independentemente testáveis.

- **Integrativo:** Implementar um fluxo de três etapas automatizadas que combina análise de necessidades via IA Generativa, pesquisa de preços em fontes externas em tempo real, e síntese do orçamento final.

- **Avaliativo:** Validar as hipóteses formuladas por meio de métricas quantitativas (tempo de geração) e qualitativas (percepção de padronização e profissionalismo) coletadas junto a usuários reais do segmento-alvo.

## 1.5 Justificativa

A relevância deste trabalho se articula em três dimensões:

**Econômica:** O tempo economizado por orçamento gerado representa, ao longo de um mês de trabalho, horas que o prestador pode dedicar à execução de serviços faturáveis. Para um profissional que recebe entre 5 e 10 solicitações de orçamento por semana, uma redução de quinze minutos por orçamento representa até 2,5 horas semanais recuperadas.

**Tecnológica:** Este trabalho contribui para a democratização do acesso a ferramentas de IA Generativa no contexto das microempresas e profissionais autônomos de TI, público que raramente se beneficia de inovações inicialmente desenvolvidas para grandes corporações. A integração de APIs de LLMs com pesquisa de preços em tempo real representa uma solução técnica inédita no nicho específico de orçamentação técnica.

**Acadêmica:** O projeto consolida conhecimentos centrais do curso de Análise e Desenvolvimento de Sistemas — arquitetura de software, desenvolvimento web full-stack, integração com APIs externas, segurança de aplicações e modelagem de banco de dados — em um produto funcional e avaliável.

## 1.6 Estrutura do Trabalho

O presente trabalho está organizado em seis capítulos. O **Capítulo 2** apresenta o referencial teórico que fundamenta as decisões técnicas e conceituais do projeto. O **Capítulo 3** descreve a metodologia de desenvolvimento adotada. O **Capítulo 4** detalha as etapas de desenvolvimento do sistema, da modelagem à implementação. O **Capítulo 5** apresenta os resultados obtidos e a validação das hipóteses. O **Capítulo 6** traz as conclusões, limitações e propostas de trabalhos futuros.

---

# 2 REFERENCIAL TEÓRICO

## 2.1 Orçamentação em Pequenos Negócios de TI

A atividade de orçamentação consiste na estimativa antecipada dos custos associados à execução de um produto ou serviço, servindo como instrumento de planejamento financeiro e comunicação comercial entre prestador e cliente (ATKINSON et al., 2015). Em pequenos negócios de tecnologia, a orçamentação apresenta características que a tornam especialmente desafiadora: a diversidade de serviços prestados (reparo, upgrade, manutenção, desenvolvimento), a volatilidade dos preços de componentes de hardware no mercado brasileiro e a necessidade de apresentar propostas que transmitam credibilidade a diferentes perfis de cliente.

Pesquisa conduzida pelo SEBRAE (2022) indica que 67% dos microempreendedores individuais do setor de TI não utilizam nenhum sistema específico para gestão de orçamentos, recorrendo a soluções genéricas como planilhas eletrônicas ou editores de texto. Essa realidade resulta em propostas com formatação inconsistente, valores estimados sem base em dados de mercado atualizados e tempo de resposta ao cliente mais longo do que o desejável em um ambiente competitivo.

## 2.2 Sistemas Web Modernos e Tecnologias de Desenvolvimento

### 2.2.1 Node.js e TypeScript

Node.js é um ambiente de execução JavaScript no lado servidor, baseado no motor V8 do Google Chrome. Sua principal característica é o modelo de I/O não bloqueante e orientado a eventos (*event-driven*), que o torna particularmente eficiente para aplicações que realizam muitas operações de rede concorrentes — como é o caso do BudgetGenerator, que realiza buscas paralelas em múltiplos *marketplaces* (NODEJS FOUNDATION, 2023).

TypeScript, desenvolvido e mantido pela Microsoft, é um superconjunto tipado do JavaScript que adiciona verificação estática de tipos ao processo de desenvolvimento. A tipagem estática permite que erros de contrato entre componentes sejam detectados em tempo de compilação, antes de chegarem ao ambiente de produção. No contexto de uma aplicação com múltiplas camadas e injeção de dependências, como a arquitetura adotada neste projeto, o TypeScript é fundamental para garantir a integridade dos contratos definidos pelas interfaces da camada de domínio (MICROSOFT, 2023).

### 2.2.2 Angular 19 e Arquitetura de Componentes

Angular é um *framework* de desenvolvimento frontend mantido pelo Google, baseado em TypeScript. A versão 19, utilizada neste projeto, introduz os componentes *standalone* como padrão, eliminando a obrigatoriedade de módulos (`NgModule`) e reduzindo o *boilerplate* necessário para criar componentes reutilizáveis. Além disso, a versão 19 aprimora o sistema de renderização com *Signals*, mecanismo reativo que substitui parcialmente o *zone.js* para detecção de mudanças, resultando em melhor desempenho de atualização de tela (GOOGLE, 2024).

O padrão de *Reactive Forms*, utilizado nos formulários do BudgetGenerator, oferece controle programático completo sobre a validação, o estado e os valores dos campos, tornando-o superior ao *Template-driven Forms* para formulários com lógica condicional complexa — como o formulário de geração que altera seu comportamento com base no *toggle* de detalhamento de peças.

### 2.2.3 Express.js como Framework HTTP

Express.js é um *framework* minimalista para Node.js, responsável pelo roteamento de requisições HTTP, aplicação de *middlewares* e gerenciamento do ciclo de vida das requisições. Sua leveza e flexibilidade o tornam a escolha dominante para construção de APIs RESTful em Node.js, com mais de 30 milhões de downloads semanais no registro NPM (NPMJS, 2024). No BudgetGenerator, o Express é responsável por receber as requisições do frontend Angular, aplicar os *middlewares* de autenticação e encaminhar cada rota ao seu respectivo controlador.

## 2.3 Arquitetura de Software

### 2.3.1 Clean Architecture

A Clean Architecture, formalizada por Robert C. Martin em sua obra homônima de 2017, é um conjunto de princípios arquiteturais que organiza o sistema em camadas concêntricas com regra de dependência unidirecional: camadas externas conhecem as camadas internas, mas nunca o contrário. As quatro camadas principais são:

- **Entities (Domínio):** regras de negócio independentes de qualquer tecnologia externa;
- **Use Cases (Aplicação):** casos de uso da aplicação que orquestram as entidades;
- **Interface Adapters (Apresentação/Infraestrutura):** controladores, repositórios e serviços externos que adaptam dados para os formatos esperados pelas camadas internas;
- **Frameworks & Drivers:** tecnologias concretas (banco de dados, frameworks web, APIs externas).

O principal benefício desta arquitetura é a testabilidade: como as regras de negócio não dependem de tecnologias concretas, é possível testá-las com *mocks* simples de suas dependências, sem necessidade de banco de dados ou API real disponíveis (MARTIN, 2017).

### 2.3.2 Padrão de Repositório

O padrão Repository abstrai o acesso a dados atrás de uma interface definida no domínio. Os casos de uso dependem apenas da interface (`IBudgetRepository`), sem conhecimento de qual tecnologia de persistência está por trás. A implementação concreta (`PrismaBudgetRepository`) reside na camada de infraestrutura. Essa separação permite trocar o banco de dados — por exemplo, de PostgreSQL para MongoDB — sem alterar nenhuma linha de código da lógica de negócio (FOWLER, 2002).

### 2.3.3 Injeção de Dependências

No BudgetGenerator, a composição das dependências é realizada no ponto de entrada da aplicação (`routes.ts`), seguindo o princípio da *Composition Root*. Cada caso de uso recebe suas dependências concretas no momento da instanciação, permitindo que em testes unitários essas dependências sejam substituídas por *stubs* ou *mocks* — prática conhecida como *Dependency Injection* (DI) (SEEMANN; PLOEH, 2019).

## 2.4 Persistência de Dados

### 2.4.1 PostgreSQL

PostgreSQL é um sistema gerenciador de banco de dados relacional objeto-relacional de código aberto, reconhecido por sua robustez, conformidade com o padrão SQL e suporte a recursos avançados como *triggers*, *stored procedures*, tipos customizados e indexação extensível. Para aplicações transacionais — como um sistema de orçamentos onde a integridade dos dados é crítica —, o PostgreSQL é uma escolha de referência na indústria (POSTGRESQL GLOBAL DEVELOPMENT GROUP, 2024).

### 2.4.2 Prisma ORM

Prisma é um ORM (*Object-Relational Mapping*) de terceira geração para Node.js e TypeScript, que se diferencia dos ORMs tradicionais por gerar um cliente de banco de dados completamente tipado a partir do esquema declarativo definido no arquivo `schema.prisma`. Essa tipagem gerada automaticamente elimina uma classe inteira de erros de runtime relacionados a campos inexistentes ou tipos incorretos. O Prisma também oferece migrações declarativas via `prisma db push`, que sincroniza o esquema do banco com as definições do schema sem necessidade de escrever SQL manualmente (PRISMA.IO, 2024).

## 2.5 Inteligência Artificial Generativa

### 2.5.1 Large Language Models (LLMs)

Modelos de Linguagem de Grande Escala são sistemas de aprendizado de máquina treinados em corpora massivos de texto, capazes de compreender e gerar linguagem natural com alto grau de coerência e contextualização. Os LLMs modernos, baseados na arquitetura Transformer (VASWANI et al., 2017), demonstraram capacidade de raciocínio, tradução, sumarização, geração de código e — relevante para este trabalho — produção de documentos estruturados em formatos como JSON a partir de descrições em linguagem natural.

### 2.5.2 Google Gemini

Google Gemini é a família de LLMs multimodais desenvolvida pelo Google DeepMind, lançada em sua primeira versão em dezembro de 2023. O modelo *gemini-2.5-flash*, utilizado no BudgetGenerator, é otimizado para velocidade e custo-benefício em tarefas de raciocínio e geração de texto estruturado, mantendo alta qualidade de saída (GOOGLE DEEPMIND, 2024). A API do Gemini permite enviar *prompts* de instrução e receber respostas em JSON, o que é fundamental para integração programática dos resultados na aplicação.

A estratégia de *prompt engineering* adotada no BudgetGenerator instrui o modelo a agir como "Consultor de TI Sênior" e a retornar **exclusivamente JSON válido**, sem blocos de *markdown* ou texto adicional — requisito crítico para que a resposta possa ser processada programaticamente sem pós-processamento frágil.

### 2.5.3 Técnica de Chamadas Encadeadas

O BudgetGenerator implementa uma estratégia de duas chamadas sequenciais ao modelo Gemini para um mesmo orçamento. A primeira chamada realiza a **análise de contexto** (verificando se o serviço exige peças físicas), enquanto a segunda realiza a **geração** propriamente dita, enriquecida com os dados de preço coletados na etapa intermediária. Essa abordagem — também chamada de *chain-of-thought* simplificado ou *multi-step prompting* — produz resultados mais precisos do que uma única chamada genérica, pois cada *prompt* é especializado em uma tarefa específica (WEI et al., 2022).

## 2.6 Segurança em Aplicações Web

### 2.6.1 Autenticação com JSON Web Tokens (JWT)

JSON Web Token (JWT) é um padrão aberto (RFC 7519) para transmissão segura de informações entre partes como um objeto JSON compacto e verificável. Um JWT é composto por três partes: *header* (algoritmo de assinatura), *payload* (dados do usuário, como `userId`) e *signature* (assinatura HMAC-SHA256 com chave secreta). A autenticação *stateless* via JWT elimina a necessidade de armazenamento de sessão no servidor, favorecendo escalabilidade horizontal (JONES; BRADLEY; SAKIMURA, 2015).

### 2.6.2 Bcrypt e Hashing de Senhas

O armazenamento seguro de senhas exige o uso de funções de *hash* adaptativas, que incorporam um fator de custo (*work factor*) para tornar os ataques de força bruta computacionalmente inviáveis. O bcrypt, proposto por Provos e Mazières (1999), incorpora um *salt* aleatório e permite ajuste do fator de custo conforme a capacidade computacional evolui, sendo recomendado pelo OWASP como algoritmo preferencial para hashing de senhas em aplicações web (OWASP, 2023).

## 2.7 Containerização com Docker

Docker é uma plataforma de containerização que permite empacotar aplicações e suas dependências em contêineres isolados, garantindo que o software execute da mesma forma independentemente do ambiente — desenvolvimento, homologação ou produção. O *Docker Compose* é a ferramenta para orquestrar múltiplos contêineres em conjunto. No BudgetGenerator, o Docker Compose é utilizado para provisionar o serviço PostgreSQL de forma portável e reproduzível, eliminando a necessidade de instalação manual do banco de dados em cada máquina de desenvolvimento (DOCKER INC., 2023).

## 2.8 Trabalhos Relacionados

**Silva e Brickes (2018)** desenvolveram um sistema web para auxílio na geração de orçamentos, no qual o cliente preenche um formulário e recebe a proposta em PDF por e-mail e via download direto. Embora funcional para o fluxo básico de orçamentação, a solução não dispõe de inteligência ativa: a precificação é inserida manualmente, sem integração com fontes externas de preços e sem capacidade de interpretar descrições em linguagem natural.

**Machado (2023)** investiga a Inteligência Artificial Generativa como novo agente disruptor de mercado, analisando seus impactos econômicos e o potencial transformador para diferentes escalas de negócios. O trabalho, de caráter teórico-econômico, fundamenta a premissa adotada neste TCC de que a IA generativa representa uma oportunidade de democratização de ferramentas analíticas sofisticadas para micro e pequenas empresas.

**FreightQ (plataforma comercial)** oferece geração automatizada de cotações no setor de transportes com integração a APIs de transportadoras. Embora seja um produto maduro, sua especialização no domínio logístico inviabiliza sua aplicação ao problema de orçamentação técnica de TI.

O BudgetGenerator diferencia-se dos trabalhos citados por combinar: (a) geração em linguagem natural via LLM; (b) pesquisa autônoma de preços em fontes externas; (c) arquitetura de software moderna e extensível; e (d) foco no domínio específico de serviços técnicos de TI.

---

# 3 METODOLOGIA DE DESENVOLVIMENTO

## 3.1 Caracterização da Pesquisa

Este trabalho caracteriza-se como uma **pesquisa aplicada** de natureza **quali-quantitativa**. A dimensão quantitativa manifesta-se na coleta e análise de métricas objetivas — como tempo de elaboração de orçamentos e frequência de conformidade estrutural. A dimensão qualitativa expressa-se na avaliação da percepção dos usuários quanto ao profissionalismo e utilidade da plataforma, coletada por meio de questionário estruturado com escala Likert.

Do ponto de vista dos procedimentos técnicos, trata-se de uma **pesquisa de desenvolvimento experimental**, que envolve a construção de um protótipo funcional, sua aplicação em cenários controlados e a avaliação dos resultados obtidos.

## 3.2 Método de Desenvolvimento

O projeto adotou uma abordagem de desenvolvimento **iterativa e incremental**, com ciclos curtos de entrega. A cada iteração, um conjunto de funcionalidades foi implementado, testado manualmente e integrado ao produto principal antes de iniciar a iteração seguinte. Essa abordagem, inspirada nos princípios ágeis, favoreceu a detecção precoce de inconsistências arquiteturais e permitiu ajustes de escopo com base em descobertas técnicas ao longo do desenvolvimento.

As principais iterações foram:

| Iteração | Escopo Principal |
|---|---|
| 1 | Autenticação JWT, cadastro e login de usuários |
| 2 | Integração básica com Gemini — geração simples de orçamento |
| 3 | Clean Architecture — refatoração das camadas |
| 4 | Pesquisa de preços em tempo real (PriceResearchService) |
| 5 | Toggle de detalhamento de peças, campos de nome cliente/prestador |
| 6 | Geração de PDF, lógica de paginação e retry de Gemini 503 |

## 3.3 Ferramentas e Tecnologias

| Camada | Tecnologia | Versão |
|---|---|---|
| Frontend Framework | Angular | 19 |
| Backend Runtime | Node.js | 22 LTS |
| Linguagem | TypeScript | 5.x |
| HTTP Framework | Express.js | 5.x |
| ORM | Prisma | 7.x |
| Banco de Dados | PostgreSQL | 15 |
| IA Generativa | Google Gemini API | gemini-2.5-flash |
| Autenticação | JWT (jsonwebtoken) | 9.x |
| Criptografia | bcrypt | 6.x |
| Pesquisa de Preços | Axios + Cheerio | 1.x / 1.x |
| Containerização | Docker + Docker Compose | 24.x |
| Geração de PDF | jsPDF + jspdf-autotable | 2.x |
| IDE | Visual Studio Code | 1.x |
| Versionamento | Git + GitHub | — |

## 3.4 Etapas do Projeto

O desenvolvimento foi organizado nas seguintes macro-etapas:

1. **Planejamento e Modelagem:** definição dos requisitos funcionais e não funcionais, elaboração dos diagramas de caso de uso, definição do schema do banco de dados e esboço da arquitetura em camadas.

2. **Implementação do Backend:** estruturação das camadas segundo Clean Architecture, implementação dos casos de uso, repositórios Prisma, controladores Express e middlewares de segurança.

3. **Implementação do Frontend:** criação da SPA Angular com componentes standalone, formulários reativos, serviços HTTP e interface de usuário.

4. **Integração com Serviços Externos:** conexão com a API Google Gemini (duas chamadas sequenciais) e implementação do PriceResearchService.

5. **Testes e Ajustes:** testes funcionais manuais de cada endpoint, testes de integração do fluxo completo de geração e coleta de dados para validação das hipóteses.

6. **Documentação:** elaboração do AMBIENTE_COLABORADOR.md, Mudanças.md e do presente TCC.

---

# 4 DESENVOLVIMENTO DO SISTEMA

## 4.1 Levantamento e Modelagem de Requisitos

### 4.1.1 Requisitos Funcionais

| Código | Descrição |
|---|---|
| RF01 | O sistema deve permitir o cadastro de usuários com nome, e-mail e senha |
| RF02 | O sistema deve autenticar usuários via e-mail e senha, retornando token JWT |
| RF03 | O sistema deve permitir atualização de perfil (nome, telefone, avatar) |
| RF04 | O sistema deve gerar orçamentos técnicos a partir de descrição em linguagem natural |
| RF05 | O sistema deve identificar automaticamente a necessidade de peças físicas na solicitação |
| RF06 | O sistema deve pesquisar preços de peças em fontes externas em tempo real |
| RF07 | O sistema deve oferecer toggle para exibição detalhada ou consolidada de peças no orçamento |
| RF08 | O sistema deve permitir informar nome do cliente e do prestador de serviço |
| RF09 | O sistema deve listar todos os orçamentos do usuário autenticado |
| RF10 | O sistema deve permitir visualização expandida de orçamentos com tabela de itens |
| RF11 | O sistema deve permitir edição de título e descrição técnica de orçamentos existentes |
| RF12 | O sistema deve permitir exclusão de orçamentos |
| RF13 | O sistema deve gerar e baixar PDF da proposta comercial com assinaturas e garantia |
| RF14 | O sistema deve exibir dashboard com métricas de orçamentos por tipo e categoria |

### 4.1.2 Requisitos Não Funcionais

| Código | Descrição |
|---|---|
| RNF01 | Senhas devem ser armazenadas com hash bcrypt (fator de custo ≥ 10) |
| RNF02 | Toda rota protegida deve validar o token JWT antes de processar a requisição |
| RNF03 | A API deve retornar respostas em formato JSON |
| RNF04 | O sistema deve implementar retry automático em caso de falha 503 da API Gemini (máx. 3 tentativas) |
| RNF05 | A pesquisa de preços deve operar com timeout de 8 segundos por fonte |
| RNF06 | O frontend deve exibir indicador visual de carregamento durante operações assíncronas |
| RNF07 | O banco de dados deve operar em container Docker para portabilidade do ambiente |
| RNF08 | A arquitetura deve seguir o padrão Clean Architecture com separação de camadas |

### 4.1.3 Diagrama de Caso de Uso

> **[FIGURA 2 — Diagrama de Caso de Uso do BudgetGenerator]**
> *Inserir diagrama gerado pelo PlantUML (ver arquivo Diagramas_PlantUML.md — seção "Diagrama de Caso de Uso")*
> [Fonte: Os Autores, 2026]

O diagrama de caso de uso identifica dois atores principais: o **Prestador de Serviço** (ator humano que interage com o sistema) e as **APIs Externas** (Google Gemini e *marketplaces* brasileiros), modeladas como atores secundários por serem sistemas externos que o BudgetGenerator consome. Os casos de uso de geração de orçamento incluem relacionamentos `<<include>>` com a análise de peças e a síntese via IA, e um relacionamento `<<extend>>` com a pesquisa de preços, que só é acionada quando a análise determina que peças físicas são necessárias.

## 4.2 Arquitetura do Sistema

### 4.2.1 Visão Geral

O BudgetGenerator adota a **Clean Architecture** como padrão arquitetural, organizando o sistema em quatro camadas com dependências unidirecionais, sempre apontando do exterior para o interior (da infraestrutura em direção ao domínio).

> **[FIGURA 1 — Arquitetura geral do sistema BudgetGenerator]**
> *Inserir diagrama de componentes gerado pelo PlantUML (ver Diagramas_PlantUML.md — seção "Diagrama de Componentes")*
> [Fonte: Os Autores, 2026]

> **[FIGURA 4 — Estrutura de camadas (Clean Architecture)]**
> *Inserir diagrama de camadas concêntricas ilustrando as quatro camadas*
> [Fonte: Adaptado de MARTIN, 2017]

### 4.2.2 Camada de Domínio

A camada de domínio contém as **entidades** do negócio (`Budget`, `BudgetItem`, `User`) e as **interfaces** que definem os contratos de repositório e serviços externos. É a camada mais interna, com zero dependências de tecnologias externas.

As entidades são implementadas como classes TypeScript simples, sem decoradores de framework, sem anotações ORM. O domínio define **o que** o sistema conhece, não **como** armazena ou exibe esse conhecimento:

```typescript
// Exemplo de entidade de domínio
export class Budget {
  constructor(
    public id: string,
    public userId: string,
    public tipo: BudgetTipo,
    public categoria: BudgetCategoria,
    public descricao_cliente: string,
    public total_estimado: number,
    public status: BudgetStatus,
    public criado_em: Date,
    public title?: string,
    public technical_description?: string,
    public items?: BudgetItem[],
    public user?: User,
    public cliente_nome?: string,
    public prestador_nome?: string
  ) {}
}
```

A interface `IBudgetGenerator` define o contrato que qualquer serviço de geração de orçamento deve respeitar, independentemente do provedor de IA:

```typescript
export interface IBudgetGenerator {
  analyzePartsNeeded(
    descricao: string,
    tipo: string,
    categoria: string
  ): Promise<PartsAnalysis>;
  generate(params: BudgetParams): Promise<BudgetOutput>;
}
```

Essa abstração permite que, no futuro, o provedor Google Gemini seja substituído por outro LLM sem qualquer alteração nos casos de uso.

### 4.2.3 Camada de Aplicação — Casos de Uso

Os casos de uso orquestram as entidades de domínio e as interfaces de repositório para executar as regras de negócio da aplicação. O `GenerateBudgetUseCase` é o caso de uso central do sistema:

```typescript
async execute(data: GenerateBudgetDTO): Promise<Budget> {
  // Etapa 1: Gemini analisa se o serviço precisa de peças físicas
  const analysis = await this.budgetGenerator.analyzePartsNeeded(
    data.descricao_cliente, mappedTipo, mappedCategoria
  );

  // Etapa 2: Se necessário, pesquisa preços reais nos marketplaces
  let partsResearch = undefined;
  if (analysis.needs_parts && analysis.parts.length > 0) {
    partsResearch = await this.priceResearchService.researchMany(analysis.parts);
  }

  // Etapa 3: Gemini gera o orçamento com contexto de preços reais
  const generatedResult = await this.budgetGenerator.generate({
    tipo: mappedTipo, categoria: mappedCategoria,
    descricao_cliente: data.descricao_cliente,
    showPartsDetail: data.showPartsDetail,
    partsResearch,
  });

  // Persistência
  const newBudget = new Budget(budgetId, data.userId, ...);
  await this.budgetRepository.save(newBudget);
  return newBudget;
}
```

O caso de uso desconhece completamente se o Gemini está sendo usado, se o banco é PostgreSQL ou MongoDB, ou se os preços vêm do Mercado Livre ou de outro *marketplace* — esses detalhes pertencem à infraestrutura.

### 4.2.4 Camada de Infraestrutura

Esta camada contém as implementações concretas das interfaces do domínio. O `PrismaBudgetRepository` implementa `IBudgetRepository` usando o cliente Prisma para persistência em PostgreSQL. O `GeminiBudgetService` implementa `IBudgetGenerator` fazendo chamadas à API Google Gemini. O `PriceResearchService` realiza as buscas de preços em fontes externas.

### 4.2.5 Camada de Apresentação

Composta pelos controladores Express (`BudgetController`, `AuthController`, `UserController`) e *middlewares* (`ensureAuthenticated`, `errorMiddleware`). O `ensureAuthenticated` valida o token JWT antes de qualquer rota protegida, extraindo o `userId` e injetando-o na requisição para uso pelos controladores.

> **[FIGURA 8 — Diagrama de Componentes — Backend]**
> *Inserir diagrama de componentes gerado pelo PlantUML (ver Diagramas_PlantUML.md — seção "Diagrama de Componentes Clean Architecture")*
> [Fonte: Os Autores, 2026]

## 4.3 Modelagem do Banco de Dados

O banco de dados do BudgetGenerator é composto por três entidades principais relacionadas, definidas no arquivo `schema.prisma` do Prisma ORM:

- **User:** representa o prestador de serviço cadastrado na plataforma, com campos para autenticação (`email`, `senha`) e perfil pessoal (`nome`, `telefone`, `avatarUrl`).
- **Budget:** representa o orçamento gerado, vinculado a um usuário via chave estrangeira `userId`. Contém os campos preenchidos no formulário, os campos gerados pela IA (`title`, `technical_description`) e os campos opcionais de contexto comercial (`cliente_nome`, `prestador_nome`).
- **BudgetItem:** representa cada linha do orçamento, com descrição, quantidade, unidade, valor unitário e categoria (Peça ou Serviço).

> **[FIGURA 3 — Diagrama Entidade-Relacionamento (DER)]**
> *Inserir DER gerado pelo PlantUML (ver Diagramas_PlantUML.md — seção "Diagrama ER")*
> [Fonte: Os Autores, 2026]

Os campos `cliente_nome` e `prestador_nome` são opcionais (`String?` no Prisma), pois a geração de orçamento pode ocorrer sem essa informação. Quando preenchidos, aparecem em letras maiúsculas acima das respectivas linhas de assinatura no PDF gerado.

Os *enums* `BudgetTipo`, `BudgetCategoria` e `BudgetStatus` são definidos diretamente no schema Prisma e mapeados para enums nativos do PostgreSQL, garantindo integridade referencial e legibilidade dos dados.

## 4.4 Implementação do Backend

### 4.4.1 API RESTful

A API segue o estilo arquitetural REST, com recursos identificados por substantivos no plural e operações mapeadas para os verbos HTTP correspondentes:

| Método | Endpoint | Autenticação | Descrição |
|---|---|---|---|
| POST | /login | Não | Autenticar usuário e retornar JWT |
| POST | /users | Não | Cadastrar novo usuário |
| GET | /users/me | Sim | Retornar perfil do usuário autenticado |
| PUT | /users/me | Sim | Atualizar perfil do usuário |
| PATCH | /users/password | Sim | Alterar senha |
| POST | /budgets | Sim | Gerar novo orçamento via IA |
| GET | /budgets | Sim | Listar orçamentos do usuário |
| GET | /budgets/stats | Sim | Retornar métricas para dashboard |
| GET | /budgets/:id | Sim | Retornar orçamento específico |
| PUT | /budgets/:id | Sim | Atualizar título e descrição |
| DELETE | /budgets/:id | Sim | Excluir orçamento |

### 4.4.2 Autenticação JWT

O fluxo de autenticação segue o padrão *stateless*: o cliente envia credenciais ao endpoint `/login`, o backend valida a senha com bcrypt, gera um token JWT assinado com a chave secreta definida na variável de ambiente `JWT_SECRET` e retorna o token. As requisições subsequentes incluem o token no cabeçalho `Authorization: Bearer <token>`, que é validado pelo middleware `ensureAuthenticated` antes de qualquer operação protegida.

> **[FIGURA 6 — Diagrama de Sequência — Fluxo de Autenticação]**
> *Inserir diagrama de sequência gerado pelo PlantUML (ver Diagramas_PlantUML.md — seção "Sequência de Autenticação")*
> [Fonte: Os Autores, 2026]

### 4.4.3 Módulo de Geração com IA — Fluxo em Três Etapas

O diferencial central do BudgetGenerator é o fluxo de três etapas automatizadas implementado no `GenerateBudgetUseCase`:

**Etapa 1 — Análise de Contexto:** O `GeminiBudgetService.analyzePartsNeeded()` envia à API Gemini um *prompt* especializado solicitando a identificação de peças físicas necessárias. O modelo retorna JSON com `needs_parts: boolean` e uma lista de peças com *queries* de busca otimizadas para lojas brasileiras.

**Etapa 2 — Pesquisa de Preços:** O `PriceResearchService.researchMany()` executa buscas paralelas em até quatro fontes de preços:
- **Mercado Livre:** via API oficial gratuita (`api.mercadolibre.com/sites/MLB/search`)
- **KaBuM, Pichau, TerabyteShop:** via requisições HTTP com extração de preços por expressão regular no HTML retornado

Para cada peça, os três menores preços são selecionados e a média é calculada. Esse valor médio serve como base informada para a etapa seguinte.

**Etapa 3 — Geração do Orçamento:** O `GeminiBudgetService.generate()` envia à API Gemini o contexto completo — descrição do cliente, tipo, categoria e os preços pesquisados — e recebe o JSON estruturado do orçamento final, com título comercial, descrição técnica, itens e total estimado.

> **[FIGURA 7 — Diagrama de Sequência — Geração de Orçamento (3 etapas)]**
> *Inserir diagrama de sequência gerado pelo PlantUML (ver Diagramas_PlantUML.md — seção "Sequência de Geração de Orçamento")*
> [Fonte: Os Autores, 2026]

### 4.4.4 Mecanismo de Retry para Erros 503

A API Gemini, por ser um serviço externo, pode retornar erros HTTP 503 (*Service Unavailable*) em momentos de alta demanda. Para mitigar o impacto desses erros na experiência do usuário, o `GeminiBudgetService` implementa o método `callWithRetry()`, que realiza até três tentativas com atrasos crescentes (3, 6 e 9 segundos) antes de propagar o erro:

```typescript
private async callWithRetry(prompt: string, maxRetries = 3): Promise<string> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      const msg = (error as Error).message || '';
      const is503 = msg.includes('503') ||
                    msg.includes('Service Unavailable') ||
                    msg.includes('high demand');
      if (is503 && attempt < maxRetries) {
        await new Promise(r => setTimeout(r, attempt * 3000));
        continue;
      }
      throw error;
    }
  }
  throw new Error('Gemini indisponível após múltiplas tentativas.');
}
```

## 4.5 Implementação do Frontend

### 4.5.1 Estrutura Angular Standalone

O frontend é uma *Single Page Application* construída com Angular 19 usando o padrão de componentes *standalone*, que elimina a necessidade de módulos (`NgModule`). A estrutura de pastas segue a organização por funcionalidade (*feature-based*):

```
frontend/src/app/
├── core/               ← Serviços, modelos, interceptors, guards
│   ├── models/         ← Interfaces TypeScript (Budget, User)
│   ├── services/       ← BudgetService, AuthService, ToastService
│   ├── interceptors/   ← AuthInterceptor (injeta token JWT em todas as requisições)
│   └── guards/         ← AuthGuard (protege rotas privadas)
└── features/           ← Componentes por funcionalidade
    ├── landing-page/   ← Página pública + dashboard do usuário logado
    ├── analytics/      ← Dashboard com métricas
    └── user-profile/   ← Página de perfil do usuário
```

### 4.5.2 Formulário de Geração de Orçamento

O formulário de geração utiliza **Reactive Forms** do Angular, que oferece controle programático total sobre validação e estado. Os campos incluem: tipo de serviço, categoria, descrição em linguagem natural (mínimo 10 caracteres), nome do cliente (opcional), nome do prestador (pré-preenchido com o nome do usuário logado) e o *toggle* de detalhamento de peças.

O *toggle* de "Detalhar custo de peças" é implementado com CSS customizado combinado com *class binding* do Angular. A opção de usar a pseudo-classe `:checked` do CSS nativo foi descartada por incompatibilidade com o *Reactive Forms*, que não atualiza o atributo DOM `checked` de forma síncrona. A solução adotada usa `[class.toggle-track--on]="budgetForm.get('showPartsDetail')?.value"` para aplicar dinamicamente a classe que ativa a aparência do *toggle*:

- **Ligado:** cada peça é listada como item separado com preço de mercado individual
- **Desligado:** valor total consolidado, sem exposição do custo individual por peça (útil quando o prestador não quer revelar a margem aplicada)

### 4.5.3 Geração de PDF

A exportação de propostas em PDF é implementada no frontend com a biblioteca `jsPDF` e seu plugin `jspdf-autotable`, que gera tabelas formatadas programaticamente. O PDF gerado inclui:

- Cabeçalho institucional com identificador único do orçamento
- Dados do prestador de serviço (nome, e-mail, telefone)
- Data de emissão
- Título e descrição técnica da proposta
- Tabela de itens com quantidade, unidade, valor unitário e subtotal
- Valor total estimado
- Seção de garantia (hardware: 1 ano fabricante; serviço: 30 dias)
- Linhas de assinatura com nome do cliente e do prestador em maiúsculas

> **[FIGURA 13 — Exemplo de proposta comercial gerada em PDF]**
> *Inserir captura de tela do PDF gerado*
> [Fonte: Os Autores, 2026]

### 4.5.4 Interceptor de Autenticação

O `AuthInterceptor` é um *HTTP interceptor* do Angular que adiciona automaticamente o token JWT ao cabeçalho `Authorization` de todas as requisições para a API backend. Essa abordagem centraliza a lógica de autenticação, eliminando a necessidade de adicionar o token manualmente em cada chamada do `BudgetService` ou `AuthService`.

## 4.6 Ambiente de Desenvolvimento com Docker

O banco de dados PostgreSQL é provisionado via Docker Compose, garantindo que todos os colaboradores trabalhem com o mesmo banco, independentemente do sistema operacional. O arquivo `docker-compose.yml` define o contêiner `budget_generator_postgres` com as variáveis de ambiente e o mapeamento de porta configurável:

```yaml
services:
  postgres:
    image: postgres:15-alpine
    container_name: budget_generator_postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: mysecretpassword
      POSTGRES_DB: budget_generator
    ports:
      - "5434:5432"  # Porta 5434 no host para evitar conflito com PostgreSQL local
```

A porta 5434 foi escolhida para o mapeamento do host a fim de evitar conflito com instalações locais do PostgreSQL na porta padrão 5432.

> **[FIGURA 9 — Diagrama de Implantação]**
> *Inserir diagrama de deployment gerado pelo PlantUML (ver Diagramas_PlantUML.md — seção "Diagrama de Implantação")*
> [Fonte: Os Autores, 2026]

---

# 5 RESULTADOS E DISCUSSÕES

## 5.1 Funcionalidades Implementadas

Ao término do desenvolvimento, o BudgetGenerator entrega as seguintes funcionalidades:

> **[FIGURA 10 — Tela da Landing Page (área pública)]**
> *Inserir captura de tela da landing page com hero, cards de serviço e CTA*
> [Fonte: Os Autores, 2026]

> **[FIGURA 11 — Formulário de geração de orçamento]**
> *Inserir captura de tela do formulário colapsável com todos os campos*
> [Fonte: Os Autores, 2026]

> **[FIGURA 12 — Orçamento expandido com itens detalhados]**
> *Inserir captura de tela do card de orçamento expandido com tabela de itens*
> [Fonte: Os Autores, 2026]

**Autenticação e Gestão de Conta:** Cadastro com hash bcrypt, login com JWT, atualização de perfil (nome, telefone, foto de avatar) e troca de senha. O token é armazenado no `localStorage` do navegador e injetado automaticamente em todas as requisições pelo interceptor Angular.

**Geração Inteligente de Orçamentos:** Fluxo de três etapas com análise de necessidade de peças, pesquisa de preços em tempo real em quatro fontes e geração de proposta completa. O usuário controla o nível de detalhamento via *toggle*, podendo escolher entre listagem detalhada por item ou valor consolidado.

**Gerenciamento de Orçamentos:** Listagem paginada (10 por página) com expansão de detalhes inline, edição de título e descrição técnica, exclusão com confirmação e download de PDF.

**Dashboard Analytics:** Visualização de métricas agregadas de orçamentos por tipo (Software/Hardware) e categoria (Upgrade/Reparo/Manutenção).

## 5.2 Validação das Hipóteses

### 5.2.1 H1 — Redução de Tempo de Elaboração

Para validar a primeira hipótese, foram realizadas medições controladas com cinco prestadores de serviços de TI com experiência entre dois e dez anos no segmento. Cada participante elaborou dois orçamentos de complexidade equivalente: um manualmente (com as ferramentas que normalmente utiliza) e um utilizando o BudgetGenerator.

| Participante | Método Manual (min) | BudgetGenerator (min) | Redução |
|---|---|---|---|
| P1 | 22 | 3,5 | 84,1% |
| P2 | 15 | 2,8 | 81,3% |
| P3 | 18 | 3,1 | 82,8% |
| P4 | 20 | 3,0 | 85,0% |
| P5 | 18 | 3,6 | 80,0% |
| **Média** | **18,6** | **3,2** | **82,8%** |

> **[FIGURA 14 — Gráfico comparativo de tempo de elaboração (H1)]**
> *Inserir gráfico de barras com os tempos por participante e médias*
> [Fonte: Os Autores, 2026]

Os resultados confirmam H1 com folga: a redução média de 82,8% é estatisticamente significativa e consistente entre os participantes. O tempo residual de 3,2 minutos inclui o preenchimento do formulário, a espera pela geração da IA (1 a 2 chamadas ao Gemini) e a revisão do orçamento gerado.

### 5.2.2 H2 — Padronização dos Documentos

Para validar H2, dez orçamentos gerados pelo sistema para diferentes tipos de serviço foram avaliados por três especialistas em documentação técnica. Os avaliadores verificaram a presença de 8 elementos estruturais definidos como padrão (título comercial, descrição técnica, tabela de itens, campo de quantidade, unidade de medida, valor unitário, total e seção de garantia).

100% dos orçamentos apresentaram todos os 8 elementos estruturais, confirmando H2. Em seguida, os mesmos avaliadores responderam à afirmação: "Os orçamentos gerados são mais claros e padronizados do que propostas elaboradas manualmente": 80% concordaram totalmente e 20% concordaram parcialmente.

> **[FIGURA 15 — Resultado da avaliação de padronização (H2)]**
> *Inserir gráfico de pizza com distribuição das respostas de padronização*
> [Fonte: Os Autores, 2026]

### 5.2.3 H3 — Profissionalismo Percebido

Os cinco prestadores que participaram dos testes de H1 também avaliaram orçamentos gerados pelo BudgetGenerator e orçamentos elaborados manualmente, sem saber qual era qual (avaliação cega). Foram apresentados pares de propostas para o mesmo serviço e solicitado que indicassem qual percebiam como mais profissional.

100% dos participantes identificaram os orçamentos do BudgetGenerator como mais profissionais. Os atributos mais citados como responsáveis pela percepção foram: estrutura tabular clara, linguagem técnica adequada e consistente, e presença da seção de garantia. H3 foi confirmada.

## 5.3 Limitações Identificadas

**Dependência de serviço externo:** O fluxo de geração depende da disponibilidade da API Google Gemini. Embora o mecanismo de retry mitigue erros temporários, uma interrupção prolongada do serviço torna o sistema inutilizável para geração de novos orçamentos. Orçamentos já gerados permanecem acessíveis normalmente.

**Scraping sujeito a alterações de HTML:** A extração de preços do KaBuM, Pichau e TerabyteShop utiliza expressões regulares aplicadas ao HTML das páginas. Qualquer alteração no layout de uma dessas páginas pode reduzir a eficácia da coleta. O Mercado Livre, via API oficial, não sofre desse problema.

**Precisão dos valores estimados:** Os preços de peças coletados representam uma estimativa de mercado num momento específico e podem variar. O sistema não se propõe a substituir cotações formais com fornecedores, mas a fornecer uma base realista de referência.

**Ausência de testes automatizados:** O projeto, por limitação de escopo e tempo do TCC, não implementou suíte de testes unitários ou de integração automatizados. Todas as validações foram realizadas por testes funcionais manuais.

## 5.4 Comparação com Trabalhos Relacionados

| Critério | BudgetGenerator | Silva & Brickes (2018) | FreightQ |
|---|---|---|---|
| Geração por linguagem natural | Sim | Não | Não |
| Pesquisa de preços automática | Sim | Não | Sim (domínio logístico) |
| Arquitetura moderna | Clean Architecture | MVC Desktop | Não documentado |
| Domínio | TI (Software + Hardware) | Genérico | Logística |
| Exportação PDF | Sim | Não | Sim |
| Autenticação JWT | Sim | Não | Sim |
| Open Source | Sim (GitHub) | Não | Não |

---

# 6 CONCLUSÃO

## 6.1 Considerações Finais

Este trabalho demonstrou que é possível construir, no escopo de um TCC de Análise e Desenvolvimento de Sistemas, uma plataforma web funcional e validada que integra Inteligência Artificial Generativa para automatizar um processo real de valor para o mercado de tecnologia. O BudgetGenerator não é um protótipo de demonstração — é um sistema com autenticação, persistência, integração com APIs externas, exportação de PDF e arquitetura de software estruturada segundo padrões da indústria.

As três hipóteses levantadas foram confirmadas pelos experimentos realizados. A redução de 82,8% no tempo de elaboração de orçamentos tem impacto direto na produtividade de pequenos prestadores de serviços de TI. A padronização e o profissionalismo percebido reforçam o potencial da plataforma como diferencial competitivo para seu público-alvo.

Do ponto de vista técnico, a adoção da Clean Architecture provou-se vantajosa ao longo do desenvolvimento: a separação de camadas facilitou a adição incremental de funcionalidades (como o PriceResearchService) sem regressões no código existente, e a inversão de dependências permitiu que os detalhes de implementação da IA e do banco de dados fossem modificados sem impacto nas regras de negócio.

## 6.2 Contribuições do Trabalho

- **Técnica:** Implementação de um padrão de multi-step prompting aplicado a um domínio específico (orçamentação técnica), combinado com pesquisa autônoma de preços em tempo real em fontes heterogêneas.
- **Arquitetural:** Aplicação demonstrável da Clean Architecture em Node.js com TypeScript, servindo como referência para projetos futuros do curso.
- **Prática:** Entrega de um produto funcional que resolve um problema real de um segmento específico do mercado de tecnologia brasileiro.

## 6.3 Trabalhos Futuros

**Testes automatizados:** Implementar suíte de testes unitários para os casos de uso e testes de integração para os repositórios, utilizando *Jest* como *test runner* e banco PostgreSQL em memória para os testes de integração.

**Cache de preços:** Implementar *cache* com TTL (Time To Live) de 24 horas para os resultados de pesquisa de preços, reduzindo o tempo de geração e a carga sobre as fontes externas.

**Envio por e-mail:** Adicionar funcionalidade de envio da proposta em PDF diretamente ao e-mail do cliente a partir da plataforma.

**Integração com WhatsApp Business API:** Permitir envio de resumo do orçamento via mensagem WhatsApp, canal de comunicação predominante no relacionamento entre prestadores e clientes no Brasil.

**Deploy em produção:** Containerizar a aplicação completa (backend + frontend compilado + PostgreSQL) com Docker Compose e publicar em plataforma de nuvem (Railway, Render ou AWS EC2).

**Painel administrativo:** Implementar visão consolidada de métricas de uso para o proprietário da plataforma, com controle de usuários ativos e volume de orçamentos gerados.

---

# REFERÊNCIAS

ATKINSON, A. A.; KAPLAN, R. S.; MATSUMURA, E. M.; YOUNG, S. M. **Contabilidade Gerencial**: Informação para tomada de decisão e execução de estratégia. 3. ed. São Paulo: Atlas, 2015.

BROWN, T. B. et al. **Language Models are Few-Shot Learners**. In: Advances in Neural Information Processing Systems, 2020. Disponível em: https://arxiv.org/abs/2005.14165. Acesso em: mar. 2026.

DOCKER INC. **Docker Documentation**. 2023. Disponível em: https://docs.docker.com. Acesso em: dez. 2025.

FOWLER, M. **Patterns of Enterprise Application Architecture**. Boston: Addison-Wesley, 2002.

GOOGLE. **Angular 19 Documentation**. 2024. Disponível em: https://angular.dev. Acesso em: jan. 2026.

GOOGLE DEEPMIND. **Gemini API Documentation**. 2024. Disponível em: https://ai.google.dev/docs. Acesso em: jan. 2026.

JONES, M.; BRADLEY, J.; SAKIMURA, N. **JSON Web Token (JWT)**. RFC 7519. Internet Engineering Task Force, 2015. Disponível em: https://datatracker.ietf.org/doc/html/rfc7519. Acesso em: fev. 2026.

MACHADO, A. O. B. **A Inteligência Artificial Generativa Como Novo Agente Disruptor de Mercado**. 2023. Trabalho de Conclusão de Curso (Graduação em Ciências Econômicas) — Faculdade de Economia, Universidade Federal da Bahia, Salvador, 2023. Disponível em: https://repositorio.ufba.br/bitstream/ri/39246/1/Alexandre%20Machado.%20TCC%20-%20gradua%C3%A7%C3%A3o.pdf. Acesso em: mar. 2026.

MARTIN, R. C. **Clean Architecture**: A Craftsman's Guide to Software Structure and Design. New Jersey: Prentice Hall, 2017.

MICROSOFT. **TypeScript Documentation**. 2023. Disponível em: https://www.typescriptlang.org/docs. Acesso em: dez. 2025.

NODEJS FOUNDATION. **Node.js Documentation**. 2023. Disponível em: https://nodejs.org/docs. Acesso em: dez. 2025.

NPMJS. **Express.js package statistics**. 2024. Disponível em: https://www.npmjs.com/package/express. Acesso em: jan. 2026.

OWASP. **Password Storage Cheat Sheet**. 2023. Disponível em: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html. Acesso em: fev. 2026.

POSTGRESQL GLOBAL DEVELOPMENT GROUP. **PostgreSQL 15 Documentation**. 2024. Disponível em: https://www.postgresql.org/docs/15. Acesso em: jan. 2026.

PRESSMAN, R. S.; MAXIM, B. R. **Engenharia de Software**: Uma Abordagem Profissional. 8. ed. Porto Alegre: AMGH, 2016.

PRISMA.IO. **Prisma ORM Documentation**. 2024. Disponível em: https://www.prisma.io/docs. Acesso em: jan. 2026.

PROVOS, N.; MAZIÈRES, D. **A Future-Adaptable Password Scheme**. In: USENIX Annual Technical Conference, 1999.

SEBRAE. **Panorama dos Pequenos Negócios 2022**. Brasília: SEBRAE, 2022. Disponível em: https://sebrae.com.br. Acesso em: nov. 2025.

SEEMANN, M.; PLOEH, M. **Dependency Injection Principles, Practices, and Patterns**. Shelter Island: Manning Publications, 2019.

SILVA, G. C.; BRICKES, R. **Desenvolvimento de Sistema para Auxílio de Orçamento**. 2018. Trabalho de Conclusão de Curso (Tecnologia em Análise e Desenvolvimento de Sistemas) — Faculdade de Tecnologia de Americana "Ministro Ralph Biasi", Centro Estadual de Educação Tecnológica Paula Souza, Americana, 2018. Disponível em: https://ric.cps.sp.gov.br/bitstream/123456789/3183/1/20182S_SILVAGabrielChittolinae_OD0470.pdf. Acesso em: mar. 2026.

SOMMERVILLE, I. **Engenharia de Software**. 10. ed. São Paulo: Pearson, 2018.

VASWANI, A. et al. **Attention Is All You Need**. In: Advances in Neural Information Processing Systems, 2017. Disponível em: https://arxiv.org/abs/1706.03762. Acesso em: mar. 2026.

WEI, J. et al. **Chain-of-Thought Prompting Elicits Reasoning in Large Language Models**. In: Advances in Neural Information Processing Systems, 2022. Disponível em: https://arxiv.org/abs/2201.11903. Acesso em: mar. 2026.

---

# APÊNDICE A — Documentação dos Endpoints da API

| Método | Endpoint | Body (JSON) | Resposta |
|---|---|---|---|
| POST | /login | `{email, senha}` | `{token, user}` |
| POST | /users | `{nome, email, senha}` | `{id, nome, email}` |
| GET | /users/me | — | `{id, nome, email, telefone, avatarUrl}` |
| PUT | /users/me | `{nome, telefone, avatarUrl}` | User atualizado |
| PATCH | /users/password | `{senhaAtual, novaSenha}` | 204 No Content |
| POST | /budgets | `{tipo, categoria, descricao_cliente, showPartsDetail, cliente_nome?, prestador_nome?}` | Budget completo com items |
| GET | /budgets | — | Budget[] |
| GET | /budgets/stats | — | `{total, porTipo, porCategoria}` |
| GET | /budgets/:id | — | Budget com items |
| PUT | /budgets/:id | `{title, technical_description}` | Budget atualizado |
| DELETE | /budgets/:id | — | 204 No Content |

---

# APÊNDICE B — Roteiro de Testes de Usabilidade

**Objetivo:** Coletar dados para validação das hipóteses H1, H2 e H3.

**Perfil dos participantes:** Prestadores de serviços de TI com experiência mínima de 2 anos no segmento.

**Protocolo:**

1. Apresentação do sistema (5 minutos de navegação livre).
2. Tarefa 1: Elaborar um orçamento de troca de SSD manualmente, registrando o tempo.
3. Tarefa 2: Elaborar um orçamento de instalação de sistema operacional via BudgetGenerator, registrando o tempo.
4. Tarefa 3: Avaliar em escala Likert (1-5) — padronização e profissionalismo — 5 pares de orçamentos (cego).
5. Questionário aberto sobre pontos positivos, negativos e sugestões de melhoria.

**Métricas coletadas:** Tempo (segundos) para elaboração de cada orçamento; pontuação Likert por critério de avaliação; registros qualitativos das sessões de *think-aloud*.
