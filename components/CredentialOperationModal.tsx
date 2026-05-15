import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { completeFidoIssuance, completeFidoVerification, getFidoIssuanceOptions, getFidoVerificationOptions } from "@/lib/api/fido";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { startAuthentication } from "@simplewebauthn/browser";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ApiError, Did } from "@/lib/types";
import { getWalletDids } from "@/lib/api/waltid";

export type DialogData = { type: "receive" } | { type: "present", credentialId: string, subject: string };

type CredentialFormData = {
    did: string;
    offerUrl: string;
};

interface Props {
    data: DialogData | null;
    onClose?: () => void;
    onSuccess?: () => void;
}

const CredentialOperationModal = ({ data, onClose, onSuccess }: Props) => {
    const [error, setError] = useState<string | null>(null);
    const [dids, setDids] = useState<Did[]>([]);
    const { register, handleSubmit, formState: { isSubmitting, errors }, reset, setValue } = useForm<CredentialFormData>();
    
    const credentialDid = data?.type === "present"
        ? dids.find(did => did.did === data.subject)?.did
        : undefined;

    const onSubmit = async (formData: CredentialFormData) => {
        try {
            setError(null);

            let optionsJSON;
            if (data?.type === "receive") optionsJSON = await getFidoIssuanceOptions(formData.did, formData.offerUrl);
            else if (data?.type === "present") optionsJSON = await getFidoVerificationOptions(formData.did, formData.offerUrl, data.credentialId);
            else return;

            const fidoResponse = await startAuthentication({ optionsJSON });

            if (data?.type === "receive") await completeFidoIssuance(fidoResponse);
            else if (data?.type === "present") await completeFidoVerification(fidoResponse);
            
            onSuccess?.();
            onClose?.();
        } catch (err) {
            setError(err instanceof ApiError ? err.message : "Failed to complete credential operation. Please try again");
        }
    };

    function closeHandler() {
        onClose?.();
        setError(null);
        reset();
    }

    useEffect(() => {
        if (!data) return;
        getWalletDids()
            .then(setDids)
            .catch((err) => {
                setError(err instanceof ApiError ? err.message : "Error fetching DIDs");
            });
    }, [data]);

    useEffect(() => {
        if (credentialDid) {
            setValue('did', credentialDid);
        }
    }, [credentialDid, setValue]);

    return (
        <Dialog open={!!data} onOpenChange={(val) => !val && closeHandler()}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>{data?.type === "receive" ? "Receive Credential" : "Present Credential"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {data?.type === "present" && (
                        <div className="mb-2 text-sm"><span className="text-gray-600 me-1">Credential ID:</span>{data.credentialId}</div>
                    )}
                    <div className="space-y-3">
                        <Label htmlFor="did">DID</Label>
                        <Select 
                            disabled={data?.type === "present" || isSubmitting} 
                            value={credentialDid}
                            onValueChange={(value) => setValue('did', value)}
                        >
                            <SelectTrigger className="w-full" >
                                <SelectValue placeholder="Select DID" />
                            </SelectTrigger>
                            <SelectContent position="popper">
                                <SelectGroup>
                                    {dids.map((did) => (
                                        <SelectItem key={did.did} value={did.did}>{did.alias}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <input type="hidden" {...register('did', { required: 'DID is required' })} />
                        {errors.did && <div className="text-red-600 text-xs">{errors.did.message}</div>}
                    </div>
                    <div className="space-y-3">
                        <Label htmlFor="offerUrl">{data?.type === "receive" ? "Offer URL" : "Presentation Request URL"}</Label>
                        <Textarea
                            id="offerUrl"
                            placeholder={data?.type === "receive" ? "Enter Offer URL" : "Enter Presentation Request URL"}
                            rows={4}
                            {...register('offerUrl', { required: 'URL is required' })}
                            disabled={isSubmitting}
                        />
                        {errors.offerUrl && <div className="text-red-600 text-xs">{errors.offerUrl.message}</div>}
                    </div>
                    {error && <div className="text-red-600 text-sm" role="alert">{error}</div>}
                    
                    <DialogFooter className="flex gap-2 mt-4">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Processing...' : 'Submit'}
                        </Button>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary" onClick={closeHandler}>Cancel</Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
export default CredentialOperationModal;