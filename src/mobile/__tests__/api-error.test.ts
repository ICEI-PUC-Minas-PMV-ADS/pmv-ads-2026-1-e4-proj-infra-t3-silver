jest.mock('../src/services/api', () => ({
  API_BASE_URL: 'http://localhost:8000/api',
}));

import { getApiErrorMessage } from '../src/utils/api-error';

test('getApiErrorMessage retorna mensagem de validacao', () => {
  const error = {
    isAxiosError: true,
    response: {
      data: {
        message: 'Erro de validação.',
        errors: { email: ['O e-mail já está em uso.'] },
      },
    },
    message: '',
  };

  expect(getApiErrorMessage(error)).toBe('O e-mail já está em uso.');
});

test('getApiErrorMessage retorna mensagem generica quando nao ha error', () => {
  expect(getApiErrorMessage('erro')).toBe(
    'Não foi possível concluir a operação. Tente novamente.'
  );
});

test('getApiErrorMessage retorna mensagem de erro de rede', () => {
  const error = {
    isAxiosError: true,
    response: undefined,
    message: 'Network Error',
  };

  const msg = getApiErrorMessage(error);
  expect(msg).toContain('Erro de rede');
  expect(msg).toContain('localhost');
});
