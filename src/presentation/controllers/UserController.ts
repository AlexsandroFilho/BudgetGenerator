import { Request, Response } from 'express';
import { RegisterUser, RegisterUserDTO } from '../../application/use-cases/RegisterUserUseCase';
import { GetUserProfileUseCase } from '../../application/use-cases/GetUserProfileUseCase';
import { UpdateUserPasswordUseCase } from '../../application/use-cases/UpdateUserPasswordUseCase';
import { UpdateUserProfileUseCase } from '../../application/use-cases/UpdateUserProfileUseCase';
import { AuthenticatedRequest } from '../protocols/http';

export class UserController {
  constructor(
    private readonly registerUserUseCase: RegisterUser,
    private readonly getUserProfileUseCase?: GetUserProfileUseCase,
    private readonly updateUserPasswordUseCase?: UpdateUserPasswordUseCase,
    private readonly updateUserProfileUseCase?: UpdateUserProfileUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const { nome, email, senha, telefone } = req.body;

      if (!nome || !email) {
        return res.status(400).json({ error: 'Os campos nome e email são obrigatórios.' });
      }

      const userDTO: RegisterUserDTO = { nome, email, senha, telefone };
      const user = await this.registerUserUseCase.execute(userDTO);

      const { senha: _, ...userWithoutPassword } = user;
      return res.status(201).json(userWithoutPassword);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  async show(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const userId = req.user.id;
    const user = await this.getUserProfileUseCase!.execute(userId);
    return res.status(200).json(user);
  }

  async update(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const userId = req.user.id;
      const { nome, email, telefone, avatarUrl } = req.body;
      
      const user = await this.updateUserProfileUseCase!.execute({
        id: userId,
        nome,
        email,
        telefone,
        avatarUrl
      });

      return res.status(200).json(user);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  async updatePassword(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const userId = req.user.id;
    const { senhaAntiga, novaSenha } = req.body;

    if (!senhaAntiga || !novaSenha) {
      return res.status(400).json({ error: 'Senha antiga e nova senha são obrigatórias.' });
    }

    await this.updateUserPasswordUseCase!.execute({ userId, senhaAntiga, novaSenha });
    return res.status(204).send();
  }
}
