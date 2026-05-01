import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { AuthenticatedRequest } from '../protocols/http';

interface IPayload {
  id: string;
}

export function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
): void | Response {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return response.status(401).json({ error: 'Token JWT ausente.' });
  }

  // O Header vem no formato "Bearer <token>"
  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    return response.status(401).json({ error: 'Token malformatado.' });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return response.status(401).json({ error: 'Token malformatado.' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'default_secret';
    const decoded = verify(token, secret) as IPayload;

    // Anexar o ID do usuário ao objeto da requisição (Cast para AuthenticatedRequest para tipagem)
    (request as AuthenticatedRequest).user = {
      id: decoded.id,
    };

    return next();
  } catch (err) {
    return response.status(401).json({ error: 'Token JWT inválido.' });
  }
}
