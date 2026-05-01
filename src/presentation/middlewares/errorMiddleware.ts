import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../domain/errors/AppError';

export function errorMiddleware(
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
): Response {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    });
  }

  // Log detalhado para facilitar diagnóstico
  console.error('═══════════════════════════════════════');
  console.error('❌ ERRO INESPERADO:', error.message);
  console.error('Stack:', error.stack);
  console.error('═══════════════════════════════════════');

  return response.status(500).json({
    status: 'error',
    message: error.message || 'Erro interno no servidor.',
  });
}
