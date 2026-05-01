import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { IPasswordHasher } from '../interfaces/IPasswordHasher';
import { randomUUID } from 'crypto';

export interface RegisterUserDTO {
  nome: string;
  email: string;
  senha?: string;
  telefone?: string;
}

export class RegisterUser {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher
  ) {}

  async execute(data: RegisterUserDTO): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    
    if (existingUser) {
      throw new Error('Já existe um usuário cadastrado com este email.');
    }

    let hashedPassword = undefined;
    if (data.senha) {
      hashedPassword = await this.passwordHasher.hash(data.senha);
    }

    const newUser = new User(
      randomUUID(),
      data.nome,
      data.email,
      hashedPassword,
      data.telefone
    );

    await this.userRepository.save(newUser);

    return newUser;
  }
}
