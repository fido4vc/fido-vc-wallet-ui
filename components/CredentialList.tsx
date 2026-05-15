import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";
import { WalletCredential } from "@/lib/types";
import { Button } from "./ui/button";
import { LucideArrowUpRight, LucideTrash2 } from "lucide-react";

interface Props {
    credentials: WalletCredential[];
    onSelect?: (credential: WalletCredential) => void;
    onDelete?: (credentialId: string) => void;
}

const CredentialList = ({ credentials, onSelect, onDelete }: Props) => {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<WalletCredential | null>(null);

    function handleClick(cred: WalletCredential) {
        setSelected(cred);
        setOpen(true);
    }

    if (credentials.length === 0) {
        return <div>No credentials found.</div>;
    }
    return (
        <>
            <table className="min-w-full border text-sm">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="p-2 border">Present</th>
                        <th className="p-2 border">ID</th>
                        <th className="p-2 border">Added On</th>
                        <th className="p-2 border">Format</th>
                        <th className="p-2 border">Pending</th>
                        <th className="p-2 border">Del</th>
                    </tr>
                </thead>
                <tbody>
                    {credentials.map((cred) => (
                        <tr key={cred.id} className="border-b cursor-pointer">
                            <td className="p-2 border text-center">
                                <Button variant={"ghost"} onClick={() => onSelect?.(cred)}>
                                    <LucideArrowUpRight />
                                </Button>
                            </td>
                            <td className="p-2 border" onClick={() => handleClick(cred)}>
                                <Button variant={"link"}>{cred.id}</Button>
                            </td>
                            <td className="p-2 border">{new Date(cred.addedOn).toLocaleString()}</td>
                            <td className="p-2 border">{cred.format}</td>
                            <td className="p-2 border">{cred.pending ? "Yes" : "No"}</td>
                            <td className="p-2 border text-center">
                                <Button variant="destructive"  onClick={() => onDelete?.(cred.id)} disabled={!onDelete}>
                                    <LucideTrash2 />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Credential parsedDocument</DialogTitle>
                    </DialogHeader>
                    <pre className="bg-gray-100 p-4 rounded text-xs overflow-x-auto max-h-[60vh]">
                        {selected ? JSON.stringify(selected.parsedDocument, null, 2) : null}
                    </pre>
                </DialogContent>
            </Dialog>
        </>
    );
};
export default CredentialList;
