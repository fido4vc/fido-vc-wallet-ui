"use client";

import { useEffect, useState } from "react";
import { ApiError, Did } from "@/lib/types";
import DidList from "@/components/DidList";
import { deleteWalletDid, deleteWalletKey, getWalletDids } from "@/lib/api/waltid"; 
import KeyCreationModal from "@/components/KeyCreationModal";

export default function DIDPage() {
  const [dids, setDids] = useState<Did[] | null>(null);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    fetchDids();
  }, []);

  async function fetchDids() {
    getWalletDids()
      .then((data) => {
        setDids(data);
      })
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : "Failed to fetch DIDs");
      })
  }

  async function deleteDid(didObj: Did) {
    try {
      await deleteWalletDid(didObj.did);
      await deleteWalletKey(didObj.keyId);
      setDids((prevDids) => prevDids!.filter((d) => d.did !== didObj.did));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to delete DID");
    }
  }

  return (
    <div className="mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">DIDs</h1>
      <KeyCreationModal onSuccess={fetchDids} />
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {dids && <DidList dids={dids} onDelete={deleteDid} />}
    </div>
  );
}
