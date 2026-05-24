import axios from 'axios';

import { API_BASE_URL } from '../services/api';

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string; errors?: Record<string, string[]> } | undefined;

    if (data?.errors) {
      const firstFieldErrors = Object.values(data.errors)[0];

      if (firstFieldErrors?.[0]) {
        return firstFieldErrors[0];
      }
    }

    if (data?.message) {
      return data.message;
    }

    if (error.message === 'Network Error') {
      return `Erro de rede ao acessar ${API_BASE_URL}. Confira se o backend esta ativo e se a URL esta correta para web, emulador ou celular.`;
    }

    if (error.message) {
      return error.message;
    }
  }

  return 'Nao foi possivel concluir a operacao. Tente novamente.';
}
