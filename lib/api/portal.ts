import { api } from "./api";

const ISSUER_API = process.env.NEXT_PUBLIC_ISSUER_URL;
const VERIFIER_API = process.env.NEXT_PUBLIC_VERIFIER_URL;

export async function createCredentialOffer(credentialData: unknown) {
    return api.post<string>(`${ISSUER_API}/openid4vc/jwt/issue`, credentialData);
}

export async function createPresentationRequest(request: unknown) {
    return api.post<string>(`${VERIFIER_API}/openid4vc/verify`, request);
}

export async function getVerificationSessionData(sessionId: string) {
    return api.get<unknown>(`${VERIFIER_API}/openid4vc/session/${sessionId}`);
}

export async function getPresentedCredentials(sessionId: string, viewMode: "simple" | "verbose" = "simple") {
    return api.get<unknown>(`${VERIFIER_API}/openid4vc/session/${sessionId}/presented-credentials`);
}