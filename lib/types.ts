// General Api

export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: unknown;
  headers?: Record<string, string>;
  requiresAuth?: boolean;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}


// DTOs for Auth and User

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData extends LoginData {
  name: string;
}

export interface LoginResponse extends User {
  token: string;
}

export interface User {
  id: string;
  username: string;
}

export type WalletAccountResponse = {
	account: string;
	wallets: WalletInfo[];
};

// Wallet DID and Credential types

export interface Did {
  did: string;
  alias: string;
  document: string;
  keyId: string;
  default: boolean;
  createdOn: string;
}

export interface WalletCredential {
  addedOn: string; 
  deletedOn: string;
  disclosures: string;
  document: string;
  format: string;
  id: string; //
  parsedDocument: ParsedCredentialDocument;
  pending: boolean; 
  wallet: string;
}

export type ParsedCredentialDocument = {
  id: string;
  type: ["VerifiableCredential", string];
  issuer?: {
    id?: string;
    name?: string;
    image?: {
      type: string;
      id: string
    };
  }
  credentialSubject: Record<string, unknown>
  issuanceDate?: string;
  expirationDate?: string;
}

export type SubjectManifest = Record<string, string>;

export type WalletInfo = {
	id: string;
	name: string;
	createdOn: string;
	addedOn: string;
	permission: string;
};

