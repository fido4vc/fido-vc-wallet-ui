import { User } from './types';

const storage = {
  get: (key: string) => typeof window !== 'undefined' ? localStorage.getItem(key) : null,
  set: (key: string, value: string) => typeof window !== 'undefined' && localStorage.setItem(key, value),
  remove: (key: string) => typeof window !== 'undefined' && localStorage.removeItem(key),
};

export function setToken(token: string) {
  storage.set('auth_token', token);
}

export function getToken() {
  return storage.get('auth_token');
}

export function setUser(user: User) {
  storage.set('auth_user', JSON.stringify(user));
}

export function getUser(): User | null {
  const userStr = storage.get('auth_user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}


export function setWalletId(walletId: string) {
  storage.set('wallet_id', walletId);
}

export function getWalletId(): string | null {
  return storage.get('wallet_id');
}

export function clearAuth() {
  storage.remove('auth_token');
  storage.remove('auth_user');
  storage.remove('wallet_id');
}

export function isAuthenticated() {
  return !!storage.get('auth_token');
}
