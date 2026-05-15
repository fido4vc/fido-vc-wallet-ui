import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogClose, DialogFooter, DialogHeader } from "./ui/dialog";
import { completeFidoKeyRegistration, getFidoKeyRegistrationOptions } from "@/lib/api/fido";
import { startRegistration } from "@simplewebauthn/browser";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { ApiError } from "@/lib/types";

type KeyFormData = {
    alias: string;
};

const KeyCreationModal = ({ onSuccess }: { onSuccess?: (did: string) => void }) => {
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const { register, handleSubmit, formState: { isSubmitting, errors }, reset } = useForm<KeyFormData>();
    
    const onSubmit = async (data: KeyFormData) => {
        try {
            setError(null);

            const optionsJSON = await getFidoKeyRegistrationOptions(data.alias);
            const fidoResponse = await startRegistration({ optionsJSON });
            const result = await completeFidoKeyRegistration(fidoResponse);

            onSuccess?.(result.did);
            setOpen(false);
            reset();
        } catch (err) {
            setError(err instanceof ApiError ? err.message : "Failed to add FIDO key");
        }
    };
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default" className="mb-4">Add Key</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Create New Key</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-3">
                        <Label htmlFor="alias">Alias for the key</Label>
                        <Input
                            id="alias"
                            placeholder="Enter Alias"
                            {...register('alias', { required: 'Alias is required' })}
                            disabled={isSubmitting}
                        />
                        {errors.alias && <div className="text-red-600 text-xs">{errors.alias.message}</div>}
                    </div>
                    {error && <div className="text-red-600 text-sm" role="alert">{error}</div>}
                    
                    <DialogFooter className="flex gap-2 mt-4">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Creating Key...' : 'Create Key'}
                        </Button>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary" onClick={() => { setOpen(false); reset(); }}>Cancel</Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default KeyCreationModal;
