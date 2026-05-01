import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { User } from '../../../domain/entities/User';
import { prisma } from './prismaClient';

export class PrismaUserRepository implements IUserRepository {
  async save(user: User): Promise<void> {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {
        nome: user.nome,
        email: user.email,
        senha: user.senha || '',
        telefone: user.telefone,
        avatarUrl: user.avatarUrl,
      },
      create: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        senha: user.senha || '',
        telefone: user.telefone,
        avatarUrl: user.avatarUrl,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    return new User(
      user.id, 
      user.nome, 
      user.email, 
      user.senha,
      user.telefone || undefined,
      user.avatarUrl || undefined
    );
  }

  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) return null;

    return new User(
      user.id, 
      user.nome, 
      user.email, 
      user.senha,
      user.telefone || undefined,
      user.avatarUrl || undefined
    );
  }

  async update(id: string, data: Partial<User>): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: {
        nome: data.nome,
        email: data.email,
        senha: data.senha,
        telefone: data.telefone,
        avatarUrl: data.avatarUrl,
      },
    });
  }
}
