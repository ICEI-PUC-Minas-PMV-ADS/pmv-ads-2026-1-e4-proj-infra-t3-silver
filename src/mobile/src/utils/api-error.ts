import axios from 'axios';

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

    if (error.message) {
      return error.message;
    }
  }

  return 'Nao foi possivel concluir a operacao. Tente novamente.';
}
