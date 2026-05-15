import { Did } from "@/lib/types";
import { LucideCopy } from "lucide-react";
import { LucideTrash2 } from "lucide-react";
import { Button } from "./ui/button";

const DidList = ({ dids, onDelete }: { dids: Did[], onDelete?: (did: Did) => void }) => {
  if (dids.length === 0) {
    return <div>No DIDs found.</div>;
  }
  return (
    <table className="min-w-full border text-sm">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2 border">Alias</th>
          <th className="p-2 border">DID</th>
          <th className="p-2 border">Created On</th>
          <th className="p-2 border">Key ID</th>
          <th className="p-2 border">Del</th>
        </tr>
      </thead>
      <tbody>
        {dids.map((did) => (
          <tr key={did.did} className="border-b">
            <td className="p-2 border">{did.alias}</td>
            <td className="p-2 border break-all text-xs text-gray-700 overflow-auto">{did.did}</td>
            <td className="p-2 border">{new Date(did.createdOn).toLocaleString()}</td>
            <td className="p-2 border">{did.keyId}</td>
            <td className="p-2 border text-center">
              <Button variant="destructive" onClick={() => onDelete?.(did)} disabled={!onDelete}>
                <LucideTrash2 />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
export default DidList;