export class AppError extends Error {
  public code: string;
  public userMessage: string;

  constructor(message: string, code = 'GENERIC_ERROR', userMessage = 'Ocorreu um erro inesperado. Por favor, tente novamente.') {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.userMessage = userMessage;
  }
}

export const translateFirebaseError = (error: any): AppError => {
  const code = error?.code || 'UNKNOWN';
  if (code.includes('permission-denied')) {
    return new AppError(
      error.message,
      'PERMISSION_DENIED',
      'Você não tem permissão para realizar esta ação ou ler estes dados. Verifique sua conta.'
    );
  }
  if (code.includes('not-found')) {
    return new AppError(
      error.message,
      'NOT_FOUND',
      'O registro ou arquivo solicitado não pôde ser encontrado no servidor.'
    );
  }
  if (code.includes('unauthenticated')) {
    return new AppError(
      error.message,
      'UNAUTHENTICATED',
      'Sua sessão expirou ou você não está autenticado. Por favor, faça login novamente.'
    );
  }
  return new AppError(
    error?.message || 'Erro desconhecido',
    code,
    'Erro de carregamento ou gravação na nuvem. Verifique sua conexão e tente novamente.'
  );
};
