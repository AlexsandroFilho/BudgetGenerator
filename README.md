# Budget Generator AI 🤖💰

Sistema inteligente de geração de orçamentos técnicos utilizando Inteligência Artificial (Google Gemini), com dashboard de analytics e exportação para PDF.

## 🚀 Tecnologias

- **Backend**: Node.js, TypeScript, Express, Prisma ORM, PostgreSQL.
- **Frontend**: Angular 19, Chart.js, jsPDF.
- **IA**: Google Gemini API.

## 🛠️ Pré-requisitos

- [Node.js](https://nodejs.org/) (v18 ou superior)
- [PostgreSQL](https://www.postgresql.org/) (ou Docker)
- Uma chave de API do [Google AI Studio (Gemini)](https://aistudio.google.com/)

## 📦 Configuração Inicial

1. **Clonar o repositório**:
   ```bash
   git clone https://github.com/AlexsandroFilho/BudgetGenerator.git
   cd BudgetGenerator
   ```

2. **Configurar variáveis de ambiente**:
   Crie um arquivo `.env` na raiz do projeto seguindo o modelo:
   ```env
   DATABASE_URL="postgresql://usuario:senha@localhost:5432/budget_generator"
   JWT_SECRET="sua_chave_secreta_aqui"
   GEMINI_API_KEY="sua_chave_gemini_aqui"
   ```

3. **Instalar dependências do Backend**:
   ```bash
   npm install
   ```

4. **Configurar o Banco de Dados**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Instalar dependências do Frontend**:
   ```bash
   cd frontend
   npm install
   ```

## 🏃 Como Executar

1. **Iniciar o Backend** (na raiz do projeto):
   ```bash
   npm run dev
   ```

2. **Iniciar o Frontend** (na pasta `frontend`):
   ```bash
   npm start
   ```

O sistema estará disponível em `http://localhost:4200`.

## 📄 Funcionalidades

- **Geração de Orçamentos**: Decomposição técnica automática de necessidades descritas pelo cliente.
- **Dashboard de Analytics**: Visualização de métricas por categoria e tipo de orçamento.
- **Exportação para PDF**: Geração de documentos profissionais prontos para impressão.
- **Perfil de Usuário**: Gestão de dados pessoais e foto de perfil.
- **Autenticação**: Sistema seguro com JWT e opção "Lembrar de mim".

---
Desenvolvido por [Alexsandro Filho](https://github.com/AlexsandroFilho).
