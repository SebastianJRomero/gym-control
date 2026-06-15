import api from './api';

export async function login(identifier, password) {

  const response = await api.post(
    '/auth/login',
    {
      identifier,
      password
    }
  );

  return response.data;
}