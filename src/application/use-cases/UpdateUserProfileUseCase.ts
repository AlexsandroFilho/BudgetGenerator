import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';

export interface UpdateUserProfileDTO {
  id: string;
  nome?: string;
  email?: string;
  telefone?: string;
  avatarUrl?: string;
}

export class UpdateUserProfileUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(data: UpdateUserProfileDTO): Promise<User> {
    const user = await this.userRepository.findById(data.id);

    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    if (data.nome) user.nome = data.nome;
    if (data.email) {
      // Verificar se o novo email já está em uso por outro usuário
      const existingUser = await this.userRepository.findByEmail(data.email);
      if (existingUser && existingUser.id !== data.id) {
        throw new Error('Este email já está sendo utilizado por outro usuário.');
      }
      user.email = data.email;
    }
    if (data.telefone !== undefined) user.telefone = data.telefone;
    if (data.avatarUrl !== undefined) user.avatarUrl = data.avatarUrl;

    await this.userRepository.update(data.id, user);

    return user;
  }
}
