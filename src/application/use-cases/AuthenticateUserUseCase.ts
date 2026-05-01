import jwt from 'jsonwebtoken';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { IPasswordHasher } from '../interfaces/IPasswordHasher';

export interface AuthenticateUserDTO {
  email: string;
  senha: string;
  rememberMe?: boolean;
}

export interface AuthenticateUserResponse {
  token: string;
}

export class AuthenticateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher
  ) {}

  async execute(data: AuthenticateUserDTO): Promise<AuthenticateUserResponse> {
    const user = await this.userRepository.findByEmail(data.email);

    if (!user) {
      throw new Error('E-mail ou senha incorretos.');
    }

    if (!user.senha) {
      throw new Error('Usuário sem senha cadastrada.');
    }

    const passwordMatch = await this.passwordHasher.compare(data.senha, user.senha);

    if (!passwordMatch) {
      throw new Error('E-mail ou senha incorretos.');
    }

    // Gerar Token JWT
    const secret = process.env.JWT_SECRET || 'default_secret';
    const expiresIn = data.rememberMe ? '30d' : '2h';
    
    const token = jwt.sign(
      { id: user.id },
      secret,
      { expiresIn }
    );

    return { token };
  }
}
