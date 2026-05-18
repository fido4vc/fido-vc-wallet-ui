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

// walt.id error responses look like {"exception": true, "id": "Unauth"} —
// no `.error` or `.message` field. Map the codes we know to user-friendly
// strings; otherwise fall back to whatever string-ish thing is available.
function extractErrorMessage(data: unknown, status: number): string {
  if (typeof data === 'string' && data) return data;
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    if (typeof obj.error === 'string') return obj.error;
    if (typeof obj.message === 'string') return obj.message;
    if (typeof obj.id === 'string') {
      const friendly: Record<string, string> = {
        Unauth: 'Invalid email or password',
      };
      return friendly[obj.id] ?? obj.id;
    }
  }
  if (status === 401) return 'Authentication failed';
  if (status === 403) return 'Forbidden';
  if (status === 404) return 'Not found';
  return 'Request failed';
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
      throw new ApiError(extractErrorMessage(data, response.status), response.status, data);
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
