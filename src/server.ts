import 'dotenv/config';
console.log('Chave carregada:', process.env.GEMINI_API_KEY?.substring(0, 5));
import express from 'express';
import routes from './main/routes';
import { errorMiddleware } from './presentation/middlewares/errorMiddleware';

const app = express();

app.use(express.json());

// Usar as rotas definidas em src/main/routes.ts
app.use(routes);

// Middleware de Erro Global (Sempre após as rotas)
app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📡 Endpoint de orçamento: http://localhost:${PORT}/budgets`);
});
