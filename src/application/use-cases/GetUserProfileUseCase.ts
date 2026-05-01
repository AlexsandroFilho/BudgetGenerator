import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';
import { AppError } from '../../domain/errors/AppError';

export class GetUserProfileUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string): Promise<Omit<User, 'senha'>> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError('Usuário não encontrado.', 404);
    }

    // Não retornar a senha por segurança
    const { senha, ...userProfile } = user;
    return userProfile;
  }
}
