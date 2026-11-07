import { describe, it, expect, beforeEach } from 'vitest';
import {
  loginWithEmail,
  logoutUser,
  getCurrentUser,
} from './authService';

describe('authService', () => {
  beforeEach(async () => {
    await logoutUser();
  });

  it('inicia sem usuário autenticado', () => {
    const user = getCurrentUser();
    expect(user).toBeNull();
  });

  it('autentica com sucesso no modo local/mock com credenciais válidas', async () => {
    const user = await loginWithEmail('admin@pampulha.org', 'senha123');
    expect(user).not.toBeNull();
    expect(user?.email).toBe('admin@pampulha.org');

    const current = getCurrentUser();
    expect(current?.email).toBe('admin@pampulha.org');
  });

  it('rejeita login com campos vazios', async () => {
    await expect(loginWithEmail('', '')).rejects.toThrow(/e-mail e senha são obrigatórios/i);
  });

  it('realiza logout com sucesso', async () => {
    await loginWithEmail('admin@pampulha.org', 'senha123');
    expect(getCurrentUser()).not.toBeNull();

    await logoutUser();
    expect(getCurrentUser()).toBeNull();
  });
});
