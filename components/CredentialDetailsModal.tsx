import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Trash2, Send, Eye, EyeOff } from "lucide-react";
import { SubjectManifest, WalletCredential } from "@/lib/types";
import { mapCredentialSubject, formatDate } from "@/lib/utils";
import { api } from "@/lib/api/api";

interface CredentialDetailsModalProps {
  credential: WalletCredential | null;
  onClose: () => void;
  onDelete: (credential: WalletCredential) => void;
  onPresent: (credential: WalletCredential) => void;
}

const CredentialDetailsModal = ({ credential, onClose, onDelete, onPresent }: CredentialDetailsModalProps) => {
  const [showFullJson, setShowFullJson] = useState(false);
  const [manifest, setManifest] = useState<SubjectManifest | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mappedSubject = useMemo(() => {
    if (!credential) return {};
    if (!manifest) return null;
    if (Object.keys(manifest).length === 0) return credential.parsedDocument.credentialSubject;
    return mapCredentialSubject(credential.parsedDocument.credentialSubject, manifest);
  }, [manifest, credential]);

  useEffect(() => {
    let stop = false;
    async function fetchManifest(type: string) {
      const manifest = await api.get<SubjectManifest>(`/api/manifest/${type}`).catch(() => ({}));
      if (stop) return;
      setManifest(manifest);
      if (Object.keys(manifest).length === 0) {
        setError("No manifest found for this credential type.");
      }
    }
    if (credential) {
      const type = credential.parsedDocument.type[1] || credential.parsedDocument.type[0];
      fetchManifest(type);
    } else {
      setManifest(null);
    }
    return () => { stop = true };
  }, [credential]);

  if (!credential) return null;

  const display = credential?.parsedDocument;

  const handleDelete = () => {
    onDelete(credential);
    setError(null);
    onClose();
  };

  const handlePresent = () => {
    onPresent(credential);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={!!credential} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl overflow-y-auto max-h-[80vh] no-scrollbar">
        <DialogHeader>
          <DialogTitle className="">
            <span className="text-xl font-bold text-gray-900 me-2">{display.type[1] || display.type[0] || "Credential"} </span>
            <span className="text-muted-foreground italic">{credential.id}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-700 uppercase">Issuer</h3>
          <div className="space-y-1">
            <div>
              <span className="text-sm font-medium text-gray-600">Name: </span>
              <span className="text-sm">{display.issuer?.name || "N/A"}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">DID: </span>
              <span className="text-sm font-mono break-all">{display.issuer?.id}</span>
            </div>
          </div>
        </div>
        <hr />
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-700 uppercase">Subject</h3>
          {mappedSubject
            ? (<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(mappedSubject).map(([key, value]) => (
                <div key={key}>
                  <span className="text-sm font-medium text-gray-600">{key}: </span>
                  <span className="text-sm">
                    {typeof value === "object" ? JSON.stringify(value) : String(value)}
                  </span>
                </div>
              ))}
            </div>)
            : "Loading..."}
          {error && <div className="text-red-600">{error}</div>}
        </div>
        <hr />
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-700 uppercase">Validity</h3>
          <div className="text-sm">
            {display.issuanceDate && formatDate(display.issuanceDate)}
            {display.expirationDate && ` - ${formatDate(display.expirationDate)}`}
          </div>
        </div>
        <hr />
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700 uppercase">Raw Data</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFullJson(!showFullJson)}
            className="flex items-center gap-2"
          >
            {showFullJson ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showFullJson ? "Hide" : "Show"}
          </Button>
        </div>
        <div className="overflow-x-auto w-full">
          {showFullJson && (
            <pre className="text-xs bg-gray-50 p-4 rounded-lg border w-full">
              {JSON.stringify(credential.parsedDocument, null, 2)}
            </pre>
          )}
        </div>
        <DialogFooter className="flex gap-2 mt-4">
          <Button variant="default" onClick={handlePresent} className="flex items-center gap-2"><Send className="h-4 w-4" />Present</Button>
          <Button variant="destructive" onClick={handleDelete} className="flex items-center gap-2"><Trash2 className="h-4 w-4" />Delete</Button>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CredentialDetailsModal;