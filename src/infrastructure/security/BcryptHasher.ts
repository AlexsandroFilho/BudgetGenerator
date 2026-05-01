import bcrypt from 'bcrypt';
import { IPasswordHasher } from '../../domain/interfaces/IPasswordHasher';

export class BcryptHasher implements IPasswordHasher {
  private readonly saltRounds = 10;

  async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltRounds);
  }

  async compare(password: string, hashed: string): Promise<boolean> {
    return await bcrypt.compare(password, hashed);
  }
}
