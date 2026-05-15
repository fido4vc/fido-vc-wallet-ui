import { AuthenticationResponseJSON, PublicKeyCredentialRequestOptionsJSON, RegistrationResponseJSON } from "@simplewebauthn/browser";
import { PublicKeyCredentialCreationOptionsJSON } from "@simplewebauthn/browser";
import { api } from "./api";

export async function getFidoKeyRegistrationOptions(alias: string) {
    return await api.post<PublicKeyCredentialCreationOptionsJSON>('/api/fido/register/start', { alias });
}
export async function completeFidoKeyRegistration(data: RegistrationResponseJSON) {
    return api.post<{did: string}>('/api/fido/register/finish', data);
}
export async function getFidoIssuanceOptions(did: string, offerURL: string) {
    return await api.post<PublicKeyCredentialRequestOptionsJSON>('/api/fido/issuance/start', { did, offerURL });
}

export async function completeFidoIssuance(data: AuthenticationResponseJSON) {
    return api.post('/api/fido/issuance/finish', data);
}

export async function getFidoVerificationOptions(did: string, presentationRequest: string, credId: string) {
    return await api.post<PublicKeyCredentialRequestOptionsJSON>('/api/fido/verification/start', { did, credId, presentationRequest });
}

export async function completeFidoVerification(data: AuthenticationResponseJSON) {
    return api.post('/api/fido/verification/finish', data);
}