const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export const apiRequest = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method || 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    });
  } catch {
    throw new ApiError('Não foi possível conectar ao servidor. Verifique se a API está em execução.', 0);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const rawBody = await response.text();
  let data: ({ error?: string } & T) | undefined;

  if (rawBody.trim()) {
    try {
      data = JSON.parse(rawBody) as { error?: string } & T;
    } catch {
      throw new ApiError('O servidor retornou uma resposta inválida.', response.status);
    }
  }

  if (!response.ok) {
    throw new ApiError(data?.error || 'Não foi possível completar a solicitação.', response.status);
  }

  return (data ?? undefined) as T;
};
