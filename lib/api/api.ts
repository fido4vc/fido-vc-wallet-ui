import { ApiRequestOptions, ApiError } from '../types';
import { getToken } from '../storage';

const WALLET_API = process.env.NEXT_PUBLIC_WALLET_API_URL;
const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_URL;

function getFullUrl(endpoint: string): string {
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) return endpoint;
  const baseUrl = endpoint.startsWith('/wallet-api') ? WALLET_API
    : endpoint.startsWith('/api/fido') ? BACKEND_API : '';
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${baseUrl}/${cleanEndpoint}`;
}

async function request<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {}, requiresAuth = true } = options;

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (requiresAuth) {
    const token = getToken();
    if (token) requestHeaders['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(getFullUrl(endpoint), {
      method,
      headers: requestHeaders,
      credentials: 'include',
      body: body ? JSON.stringify(body) : undefined,
    });

    const contentType = response.headers.get('content-type');
    const data = contentType?.includes('application/json')
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      throw new ApiError(data?.error || data || 'Request failed', response.status, data);
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(error instanceof Error ? error.message : 'Network error', 0, error);
  }
}

export const api = {
  get: <T>(endpoint: string, options?: Omit<ApiRequestOptions, 'method'>) =>
    request<T>(endpoint, { ...options, method: 'GET' }),
  post: <T>(endpoint: string, body?: unknown, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
    request<T>(endpoint, { ...options, method: 'POST', body }),
  delete: <T>(endpoint: string, options?: Omit<ApiRequestOptions, 'method'>) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
};
