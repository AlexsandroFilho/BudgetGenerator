import { Router } from 'express';
import { BudgetController } from '../presentation/controllers/BudgetController';
import { AuthenticatedRequest } from '../presentation/protocols/http';
import { GenerateBudgetUseCase } from '../application/use-cases/GenerateBudgetUseCase';
import { ListUserBudgetsUseCase } from '../application/use-cases/ListUserBudgetsUseCase';
import { GetBudgetByIdUseCase } from '../application/use-cases/GetBudgetByIdUseCase';
import { DeleteBudgetUseCase } from '../application/use-cases/DeleteBudgetUseCase';
import { UpdateBudgetUseCase } from '../application/use-cases/UpdateBudgetUseCase';
import { GetBudgetStatsUseCase } from '../application/use-cases/GetBudgetStatsUseCase';

import { PrismaBudgetRepository } from '../infrastructure/database/prisma/PrismaBudgetRepository';
import { GeminiBudgetService } from '../infrastructure/external-services/GeminiBudgetService';

// Usuários
import { UserController } from '../presentation/controllers/UserController';
import { RegisterUser } from '../application/use-cases/RegisterUserUseCase';
import { GetUserProfileUseCase } from '../application/use-cases/GetUserProfileUseCase';
import { UpdateUserPasswordUseCase } from '../application/use-cases/UpdateUserPasswordUseCase';
import { UpdateUserProfileUseCase } from '../application/use-cases/UpdateUserProfileUseCase';
import { PrismaUserRepository } from '../infrastructure/database/prisma/PrismaUserRepository';
import { BcryptPasswordHasher } from '../infrastructure/external-services/BcryptPasswordHasher';

// Autenticação
import { AuthController } from '../presentation/controllers/AuthController';
import { AuthenticateUserUseCase } from '../application/use-cases/AuthenticateUserUseCase';

import { ensureAuthenticated } from '../presentation/middlewares/ensureAuthenticated';

const router = Router();

// --- Dependências Compartilhadas ---
const userRepository = new PrismaUserRepository();
const passwordHasher = new BcryptPasswordHasher();

// --- Budgets ---
// ... (omitted for brevity in replace, but keeping logic)
const budgetRepository = new PrismaBudgetRepository();
const budgetGenerator = new GeminiBudgetService();

const generateBudgetUseCase = new GenerateBudgetUseCase(budgetRepository, budgetGenerator);
const listUserBudgetsUseCase = new ListUserBudgetsUseCase(budgetRepository);
const getBudgetByIdUseCase = new GetBudgetByIdUseCase(budgetRepository);
const deleteBudgetUseCase = new DeleteBudgetUseCase(budgetRepository);
const updateBudgetUseCase = new UpdateBudgetUseCase(budgetRepository);
const getBudgetStatsUseCase = new GetBudgetStatsUseCase(budgetRepository);

const budgetController = new BudgetController(
  generateBudgetUseCase,
  listUserBudgetsUseCase,
  getBudgetByIdUseCase,
  deleteBudgetUseCase,
  updateBudgetUseCase,
  getBudgetStatsUseCase
);

// --- Users ---
const registerUserUseCase = new RegisterUser(userRepository, passwordHasher);
const getUserProfileUseCase = new GetUserProfileUseCase(userRepository);
const updateUserPasswordUseCase = new UpdateUserPasswordUseCase(userRepository, passwordHasher);
const updateUserProfileUseCase = new UpdateUserProfileUseCase(userRepository);

const userController = new UserController(
  registerUserUseCase,
  getUserProfileUseCase,
  updateUserPasswordUseCase,
  updateUserProfileUseCase
);

// --- Auth ---
const authenticateUserUseCase = new AuthenticateUserUseCase(userRepository, passwordHasher);
const authController = new AuthController(authenticateUserUseCase);

// --- Rotas ---

// Orçamentos - Protegidas por Middleware
router.post('/budgets', ensureAuthenticated, (req, res, next) => budgetController.create(req as AuthenticatedRequest, res, next));
router.get('/budgets', ensureAuthenticated, (req, res, next) => budgetController.index(req as AuthenticatedRequest, res, next));
router.get('/budgets/stats', ensureAuthenticated, (req, res, next) => budgetController.getStats(req as AuthenticatedRequest, res, next));
router.get('/budgets/:id', ensureAuthenticated, (req, res, next) => budgetController.show(req as AuthenticatedRequest, res, next));
router.put('/budgets/:id', ensureAuthenticated, (req, res, next) => budgetController.update(req as AuthenticatedRequest, res, next));
router.delete('/budgets/:id', ensureAuthenticated, (req, res, next) => budgetController.delete(req as AuthenticatedRequest, res, next));

// Usuários
router.post('/users', (req, res) => userController.handle(req, res));
router.get('/users/me', ensureAuthenticated, (req, res) => userController.show(req as AuthenticatedRequest, res));
router.put('/users/me', ensureAuthenticated, (req, res) => userController.update(req as AuthenticatedRequest, res));
router.patch('/users/password', ensureAuthenticated, (req, res) => userController.updatePassword(req as AuthenticatedRequest, res));

// Login
router.post('/login', (req, res) => authController.handle(req, res));

export default router;
