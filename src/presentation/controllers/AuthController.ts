import { Request, Response } from 'express';
import { AuthenticateUserUseCase } from '../../application/use-cases/AuthenticateUserUseCase';

export class AuthController {
  constructor(private readonly authenticateUserUseCase: AuthenticateUserUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const { email, senha, rememberMe } = req.body;

      if (!email || !senha) {
        return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
      }

      const { token } = await this.authenticateUserUseCase.execute({ email, senha, rememberMe });

      return res.status(200).json({ token });
    } catch (error) {
      return res.status(401).json({ error: (error as Error).message });
    }
  }
}
