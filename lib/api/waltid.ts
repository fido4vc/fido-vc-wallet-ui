import { api } from './api';
import { RegisterData, LoginData, LoginResponse, Did, WalletAccountResponse, WalletCredential, SubjectManifest  } from '../types';
import { getWalletId } from '../storage';

export async function register(data: RegisterData) {
  return api.post<string>('/wallet-api/auth/register', {
    type: 'email',
    name: data.name,
    email: data.email,
    password: data.password,
  }, { requiresAuth: false });
}

export async function login(data: LoginData) {
  return await api.post<LoginResponse>('/wallet-api/auth/login', {
    type: 'email',
    email: data.email,
    password: data.password,
  }, { requiresAuth: false });
}


export async function getWallets() {
  return api.get<WalletAccountResponse>('/wallet-api/wallet/accounts/wallets');
}

export async function getWalletDids() {
  const walletId = getWalletId()!;
  const dids = await api.get<Did[]>(`/wallet-api/wallet/${walletId}/dids`);
  return dids.sort((a, b) => new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime());
}

export async function getWalletCredentials() {
  const walletId = getWalletId()!;
  const credentials = await api.get<WalletCredential[]>(`/wallet-api/wallet/${walletId}/credentials`);
  return credentials.sort((a, b) => new Date(b.addedOn).getTime() - new Date(a.addedOn).getTime());
}

export async function deleteWalletCredential(credentialId: string) {
  const walletId = getWalletId()!;
  return api.delete<void>(`/wallet-api/wallet/${walletId}/credentials/${credentialId}?permanent=true`);
}

export async function getCredentialSubject(credentialId: string) {
  const walletId = getWalletId()!;
  return api.get<string>(`/wallet-api/wallet/${walletId}/credentials/${credentialId}/subject`);
}

export async function getCredentialManifest(credentialType: string) {
  return api.get<{claims: SubjectManifest}>(`https://credentials.test.waltid.cloud/api/manifest/${credentialType}`);
}

export async function deleteWalletDid(didId: string) {
  const walletId = getWalletId()!;
  return api.delete<void>(`/wallet-api/wallet/${walletId}/dids/${didId}`);
}

export async function deleteWalletKey(keyId: string) {
  const walletId = getWalletId()!;
  return api.delete<void>(`/wallet-api/wallet/${walletId}/keys/${keyId}`);
}