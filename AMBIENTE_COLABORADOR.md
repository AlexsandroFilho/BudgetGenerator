# Guia de Ambiente para Colaboradores — BudgetGenerator

> **Para a IA do colaborador:** leia este arquivo ANTES de qualquer ação pós-merge.
> Ele lista tudo que foi alterado na branch `heitor/desenvolvimento` que pode quebrar o ambiente local.
> Execute cada checklist na ordem indicada.

---

## Diagnóstico Rápido — O que mudou e por quê

| Área | O que mudou | Impacto |
|---|---|---|
| `docker-compose.yml` | Porta `5432→5434` (host) | Banco pode não subir se `.env` não for ajustado |
| `prisma/schema.prisma` | +`cliente_nome`, +`prestador_nome`, +`unidade` | Banco desatualizado — queries vão falhar |
| `package.json` | +`axios`, +`cheerio` | `node_modules` desatualizado — import vai quebrar |
| `src/infrastructure/external-services/` | Novo arquivo `PriceResearchService.ts` | Incluído no merge automaticamente — sem ação |
| `frontend/public/BG.png` | Nova imagem de hero | Incluída no merge automaticamente — sem ação |

---

## 1. Porta do Docker — VERIFIQUE ANTES DE SUBIR

**O que aconteceu:** A porta foi alterada de `5432:5432` para `5434:5432` para evitar conflito com o PostgreSQL instalado localmente na máquina do Heitor.

**A IA deve fazer:**
1. Verificar se há um processo rodando na porta 5432 localmente:
   ```bash
   netstat -ano | findstr :5432   # Windows
   lsof -i :5432                  # Linux/Mac
   ```
2. **Se a porta 5432 está livre** → pode reverter `docker-compose.yml` para `"5432:5432"` e usar `localhost:5432` no `.env`
3. **Se a porta 5432 está ocupada** → mantenha `"5434:5432"` e use `localhost:5434` no `.env`
4. Garantir que `DATABASE_URL` no `.env` usa a **mesma porta** escolhida acima

---

## 2. Arquivo `.env` — Não versionado, mas precisa ser verificado

O `.env` está no `.gitignore` — o seu arquivo local **não será sobrescrito**. Porém, valide que ele contém:

```env
DATABASE_URL="postgresql://postgres:mysecretpassword@localhost:[PORTA_ESCOLHIDA]/budget_generator"
JWT_SECRET="[qualquer string secreta — pode ser a sua]"
GEMINI_API_KEY="[sua própria chave da API Gemini]"
PORT=3000
```

> **GEMINI_API_KEY:** cada colaborador deve usar a própria chave. Não use a chave do Heitor em produção.
> A chave do Heitor **não foi commitada** — está apenas no `.env` local dele.

---

## 3. Schema do Banco — ATUALIZAÇÃO OBRIGATÓRIA

Três campos foram adicionados ao banco de dados:

| Tabela | Campo | Tipo |
|---|---|---|
| `Budget` | `cliente_nome` | `String?` (opcional) |
| `Budget` | `prestador_nome` | `String?` (opcional) |
| `BudgetItem` | `unidade` | `String @default("un")` |

**A IA deve executar na ordem:**
```bash
npx prisma db push
npx prisma generate
```

> Se `prisma db push` falhar: verifique se o Docker está rodando com `docker-compose up -d` antes.

---

## 4. Dependências do Backend — REINSTALAR

Duas dependências foram adicionadas ao `package.json`:
- `axios` ^1.15.2
- `cheerio` ^1.2.0

**A IA deve executar** (na pasta raiz do projeto, onde fica `package.json`):
```bash
npm install
```

---

## 5. Checklist Completo Pós-Merge (executar nesta ordem)

```
[ ] 1. docker-compose up -d
        → Subir o banco de dados

[ ] 2. Verificar .env — porta do DATABASE_URL bate com docker-compose.yml?

[ ] 3. npm install
        → Na raiz do projeto (backend)

[ ] 4. npx prisma db push
        → Aplica os novos campos no banco

[ ] 5. npx prisma generate
        → Regenera o Prisma Client com os novos campos

[ ] 6. npm run dev
        → Iniciar o backend (porta 3000)

[ ] 7. cd frontend && npm start
        → Iniciar o Angular (porta 4200)
```

---

## O que NÃO precisa mudar

- Credenciais do PostgreSQL no Docker (`POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`) — iguais ao original
- Estrutura de pastas e arquitetura do projeto
- Configurações do Angular (`angular.json`, `tsconfig.json`)
- JWT_SECRET — pode manter o seu, não precisa ser igual ao do Heitor
- Nenhum dado existente no banco será perdido — `db push` só **adiciona** campos, não apaga

---

## Como a IA deve proceder se encontrar erros

| Erro | Causa provável | Solução |
|---|---|---|
| `connect ECONNREFUSED 127.0.0.1:5432` | Porta errada no `.env` | Ajustar para a porta do docker-compose |
| `Unknown argument 'cliente_nome'` | Prisma Client desatualizado | `npx prisma generate` |
| `Cannot find module 'axios'` | `npm install` não foi rodado | `npm install` na raiz |
| `relation "Budget" does not exist` | `db push` não foi rodado | `npx prisma db push` |
| Imagem hero não aparece | Normal se cache Angular | `ng cache clean && npm start` |
