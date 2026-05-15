"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import CredentialOperationModal, { type DialogData } from "@/components/CredentialOperationModal";
import CredentialCard from "@/components/CredentialCard";
import CredentialDetailsModal from "@/components/CredentialDetailsModal";
import { deleteWalletCredential, getCredentialManifest, getCredentialSubject, getWalletCredentials } from "@/lib/api/waltid";
import { ApiError, WalletCredential } from "@/lib/types";
import { Plus } from "lucide-react";


export default function CredentialsPage() {
  const [modalData, setModalData] = useState<DialogData | null>(null);
  const [credentials, setCredentials] = useState<WalletCredential[] | null>(null);
  const [selectedCredential, setSelectedCredential] = useState<WalletCredential | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCredentials();
  }, []);

  async function handleSuccess() {
    if (modalData?.type === "receive") fetchCredentials();
    else if (modalData?.type === "present") alert("Presentation successful!");
  }

  async function fetchCredentials() {
    try {
      setLoading(true);
      const credentials = await getWalletCredentials();
      setCredentials(credentials);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to fetch credentials");
    } finally {
      setLoading(false);
    }
  }

  async function deleteCredential(credential: WalletCredential) {
    try {
      await deleteWalletCredential(credential.id);
      setCredentials((prev) => prev!.filter((c) => c.id !== credential.id));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to delete credential");
    }
  }

  async function onPresent(credential: WalletCredential) {
    const subject = await getCredentialSubject(credential.id);
    setModalData({ type: "present", credentialId: credential.id, subject });
  }

  async function onViewCredential(credential: WalletCredential) {
    setSelectedCredential(credential);
  }

  if (loading) {
    return (
      <div className="mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Credentials</h1>
        <div className="text-center py-8">Loading credentials...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Credentials</h1>
        <Button
          variant="default"
          onClick={() => setModalData({ type: "receive" })}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Receive Credential
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md mb-4">
          {error}
        </div>
      )}

      {credentials && credentials.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No credentials found</p>
          <Button onClick={() => setModalData({ type: "receive" })}>
            Receive your first credential
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {credentials?.map((credential) => (
            <CredentialCard
              key={credential.id}
              credential={credential}
              onView={onViewCredential}
              onPresent={onPresent}
            />
          ))}
        </div>
      )}
      <CredentialOperationModal
        data={modalData}
        onClose={() => setModalData(null)}
        onSuccess={handleSuccess}
      />
      <CredentialDetailsModal
        credential={selectedCredential}
        onClose={() => setSelectedCredential(null)}
        onDelete={deleteCredential}
        onPresent={onPresent}
      />
    </div>
  );
}

