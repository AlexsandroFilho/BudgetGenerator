import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { IPasswordHasher } from '../interfaces/IPasswordHasher';
import { AppError } from '../../domain/errors/AppError';

export interface UpdateUserPasswordDTO {
  userId: string;
  senhaAntiga: string;
  novaSenha: string;
}

export class UpdateUserPasswordUseCase {
  constructor(
    private userRepository: IUserRepository,
    private passwordHasher: IPasswordHasher
  ) {}

  async execute({ userId, senhaAntiga, novaSenha }: UpdateUserPasswordDTO): Promise<void> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError('Usuário não encontrado.', 404);
    }

    if (!user.senha) {
      throw new AppError('Usuário não possui uma senha cadastrada.', 400);
    }

    // Validar senha antiga
    const passwordMatch = await this.passwordHasher.compare(senhaAntiga, user.senha);
    if (!passwordMatch) {
      throw new AppError('A senha antiga está incorreta.', 401);
    }

    // Hashear nova senha e atualizar
    const hashedNewPassword = await this.passwordHasher.hash(novaSenha);
    await this.userRepository.update(userId, { senha: hashedNewPassword });
  }
}
