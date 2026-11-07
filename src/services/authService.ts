import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { getFirebaseAuth } from './firebase';
import { AuthUser } from '../types/auth';

const LOCAL_AUTH_KEY = 'pampulha_admin_user';

const mapFirebaseUser = (user: FirebaseUser | null): AuthUser | null => {
  if (!user) return null;
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || user.email?.split('@')[0] || 'Administrador',
  };
};

export const getCurrentUser = (): AuthUser | null => {
  const auth = getFirebaseAuth();

  if (auth && auth.currentUser) {
    return mapFirebaseUser(auth.currentUser);
  }

  try {
    const raw = localStorage.getItem(LOCAL_AUTH_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
};

export const loginWithEmail = async (email: string, password: string): Promise<AuthUser> => {
  if (!email.trim() || !password.trim()) {
    throw new Error('E-mail e senha são obrigatórios.');
  }

  const auth = getFirebaseAuth();

  if (auth) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = mapFirebaseUser(userCredential.user);
      if (!user) throw new Error('Não foi possível obter os dados do usuário.');
      return user;
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        throw new Error('E-mail ou senha incorretos.');
      }
      if (err.code === 'auth/user-not-found') {
        throw new Error('Usuário não cadastrado.');
      }
      throw new Error(err.message || 'Falha ao autenticar.');
    }
  }

  // Fallback Local / Modo Demonstração
  const mockUser: AuthUser = {
    uid: `admin-${Date.now()}`,
    email,
    displayName: 'Administrador Pampulha',
  };

  localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(mockUser));
  return mockUser;
};

export const logoutUser = async (): Promise<void> => {
  const auth = getFirebaseAuth();

  if (auth) {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('Erro ao deslogar do Firebase:', err);
    }
  }

  localStorage.removeItem(LOCAL_AUTH_KEY);
};

export const subscribeToAuthChanges = (callback: (user: AuthUser | null) => void): (() => void) => {
  const auth = getFirebaseAuth();

  if (auth) {
    return onAuthStateChanged(auth, (user) => {
      callback(mapFirebaseUser(user));
    });
  }

  // Notificação inicial no modo local
  callback(getCurrentUser());
  return () => {};
};
